import { useCallback, useEffect, useRef } from "react";
import useStateWithCallback from "./useStateWithCallback";
import {useApollo} from '../apollo/client';
import addVideoPeer, {addVideoPeer_Subscription} from '../apollo/subsciptions/addVideoPeer';
import joinVideoRoom from "../apollo/mutations/joinVideoRoom";
import leaveVideoRoom from "../apollo/mutations/leaveVideoRoom";
import relayICE from "../apollo/mutations/relayICE";
import sessionDescription, {sessionDescription_Subscription} from "../apollo/subsciptions/sessionDescription";
import relaySDP from "../apollo/mutations/relaySDP";
import iceCandidate, { iceCandidate_Subscription } from "../apollo/subsciptions/iceCandidate";
import removeVideoPeer, { removeVideoPeer_Subscription } from "../apollo/subsciptions/removeVideoPeer";
const freeice = require('freeice');


const useWebRTC = (roomId: number, authUserId: number): [typeof clients, typeof provideMediaRef] => {
    const [clients, updateClients] = useStateWithCallback<number[]>([]);
    const apolloClient = useApollo();

    const peerConnections = useRef<{[peerId: number]: RTCPeerConnection}>({});
    const localMediaStream = useRef<MediaStream|null>(null);
    const peerMediaElements = useRef<{[id: number]: HTMLMediaElement|null}>({
        [authUserId]: null
    });

    const addNewClient = useCallback((newClient: number, callback: (state: typeof clients) => any) => {
        if(!clients.includes(newClient))
            updateClients(oldClients => [...oldClients, newClient], callback);
    }, [clients, updateClients]);
    
    
    //SessionDescription handler
    useEffect(() => {
        async function setRemoteMedia(peerId: number, sessionDescription: RTCSessionDescriptionInit){
            if(!peerConnections.current[peerId]) return console.warn(`Uncknown RTC peer: ${peerId}`);

            peerConnections.current[peerId].setRemoteDescription(new RTCSessionDescription(sessionDescription));

            if(sessionDescription.type == 'offer'){
                const answer = await peerConnections.current[peerId].createAnswer();
                
                peerConnections.current[peerId].setLocalDescription(answer);
                apolloClient.mutate({
                    mutation: relaySDP,
                    variables: {
                        targetPeer: peerId,
                        sessionDescription: answer
                    }
                })
            }
        }

        apolloClient.subscribe<sessionDescription_Subscription>({
            query: sessionDescription
        }).subscribe({
            next(data){
                if(data.data?.sessionDescription)
                    setRemoteMedia(data.data.sessionDescription.peerId, data.data.sessionDescription.sessionDescription)
            }
        });
    }, []);

    //IceCandidate handler
    useEffect(() => {
        apolloClient.subscribe<iceCandidate_Subscription>({
            query: iceCandidate
        }).subscribe({
            next(data){
                if(data.data?.iceCandidate){
                    const {peerId, iceCandidate} = data.data.iceCandidate;
                    if(!peerConnections.current[peerId]) return console.warn(`Uncknown RTC peer: ${peerId}`);

                    peerConnections.current[peerId].addIceCandidate(new RTCIceCandidate(iceCandidate));
                }
            }
        });
    }, []);

    //New Peer handler
    useEffect(() => {
        async function handleNewPeer(peerId: number, createOffer: boolean){
            if(peerId in peerConnections.current){
                return console.warn(`Already connection to peer ${peerId}`);
            }

            peerConnections.current[peerId] = new RTCPeerConnection({
                iceServers: freeice()
            });
            peerConnections.current[peerId].onicecandidate = event => {
                if(event.candidate){
                    apolloClient.mutate({
                        mutation: relayICE,
                        variables: {
                            targetPeer: peerId,
                            iceCandidate: event.candidate
                        }
                    });
                }
            };

            let tracksCount = 0;
            peerConnections.current[peerId].ontrack = event => {
                ++tracksCount;

                if(tracksCount == 2){
                    const remoteStream = event.streams[0];
                    addNewClient(peerId, () => {
                        peerMediaElements.current[peerId]!.srcObject = remoteStream;
                    });
                }
            };

            localMediaStream.current?.getTracks().forEach(track => {
                peerConnections.current[peerId].addTrack(track, localMediaStream.current!);
            });

            if(createOffer){
                const offer = await peerConnections.current[peerId].createOffer();

                await peerConnections.current[peerId].setLocalDescription(offer);
                apolloClient.mutate({
                    mutation: relaySDP,
                    variables: {
                        targetPeer: peerId,
                        sessionDescription: offer
                    }
                });
            }
        }

        apolloClient.subscribe<addVideoPeer_Subscription>({
            query: addVideoPeer
        }).subscribe({
            next(data){
                if(data.data?.addVideoPeer)
                    handleNewPeer(data.data?.addVideoPeer.peerId, data.data?.addVideoPeer.createOffer)
            }
        });
    }, []);

    //Remove client
    useEffect(() => {
        apolloClient.subscribe<removeVideoPeer_Subscription>({
            query: removeVideoPeer
        }).subscribe({
            next(data){
                if(data.data?.removeVideoPeer){
                    const {peerId} = data.data.removeVideoPeer;

                    delete peerConnections.current[peerId];
                    delete peerMediaElements.current[peerId];

                    updateClients(oldClients => {
                        const removeCandidateIndex = oldClients.findIndex(client => client === peerId);
                        oldClients.slice(removeCandidateIndex, 1);
                        return oldClients;
                    });
                }
            }
        });
    }, []);

    //Join new client
    useEffect(() => {
        async function startCapture(){
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true, 
                video: {
                    width: 1280,
                    height: 720
                },
            });

            addNewClient(authUserId, () => {
                const localVideoElement = peerMediaElements.current[authUserId!];

                if(!localVideoElement) return;
                localVideoElement.muted = true;
                localVideoElement.srcObject = localMediaStream.current;
            });
        }

        startCapture()
        .then(() => apolloClient.mutate({
                mutation: joinVideoRoom,
                variables: {
                    roomId
                }
            })
        )
        .catch(err => console.warn(`Error when get user media: ${err}`));

        return(() => {
            localMediaStream.current?.getTracks().forEach(track => track.stop());
            apolloClient.mutate({
                mutation: leaveVideoRoom
            });
        });
    }, [roomId]);


    const provideMediaRef = useCallback((clientId: number, node: HTMLMediaElement|null) => {
        peerMediaElements.current[clientId] = node;
    }, []);

    return [clients, provideMediaRef];
};

export default useWebRTC;