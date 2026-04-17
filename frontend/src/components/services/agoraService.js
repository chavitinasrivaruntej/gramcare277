import AgoraRTC from "agora-rtc-sdk-ng";

const APP_ID = "64cd70894c874799ac971469961c0daa";

let client = null;
let localTracks = [];
let callIsActive = false;

export const startAgoraCall = async (channelName, localContainer, remoteContainer, onRemoteUserJoined) => {
    // Prevent multiple initializations or race conditions
    if (callIsActive && client) {
        console.warn("Agora call already active or joining. Skipping redundant call.");
        return;
    }
    
    try {
        callIsActive = true;
        
        if (!client) {
            client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
        }

        // Join the channel
        await client.join(APP_ID, channelName, null, null);

        // Create tracks if not exists
        if (localTracks.length === 0) {
            localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        }

        // Play local video with a small delay to ensure DOM is ready
        if (localContainer) {
            setTimeout(() => {
                const el = document.getElementById(localContainer);
                if (el && localTracks[1]) {
                    localTracks[1].play(localContainer);
                } else {
                    console.warn(`Local container ${localContainer} not found yet.`);
                }
            }, 300);
        }

        await client.publish(localTracks);

        // Subscribe to remote users
        client.on("user-published", async (user, mediaType) => {
            await client.subscribe(user, mediaType);

            if (mediaType === "video") {
                const playRemote = () => {
                    const el = document.getElementById(remoteContainer);
                    if (el) {
                        user.videoTrack.play(remoteContainer);
                        if (onRemoteUserJoined) onRemoteUserJoined(user);
                    } else {
                        // Retry loop to handle React re-renders or delayed mounting
                        setTimeout(playRemote, 500);
                    }
                };
                playRemote();
            }

            if (mediaType === "audio") {
                user.audioTrack.play();
            }
        });

        client.on("user-unpublished", (user) => {
            // Optional: Handle remote user leaving
        });

    } catch (error) {
        console.error("Agora startAgoraCall failure:", error);
        callIsActive = false;
        throw error;
    }
};

export const endAgoraCall = async () => {
    try {
        if (localTracks.length > 0) {
            localTracks.forEach(track => {
                track.stop();
                track.close();
            });
            localTracks = [];
        }

        if (client) {
            await client.leave();
            // We keep the client instance to avoid recreating it multiple times
        }
        
        callIsActive = false;
    } catch (error) {
        console.error("Agora endAgoraCall failure:", error);
        callIsActive = false;
    }
};