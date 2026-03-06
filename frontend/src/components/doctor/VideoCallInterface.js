import { User, Video, VideoOff, Mic, MicOff, PhoneOff, Monitor, MonitorOff, Settings, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function VideoCallInterface({ 
  isCallActive, 
  isVideoOn, 
  isAudioOn, 
  isScreenSharing,
  callDuration,
  patientName,
  setIsCallActive,
  setIsVideoOn,
  setIsAudioOn,
  setIsScreenSharing,
  setCallDuration
}) {
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-1/2 border-r border-border flex flex-col bg-slate-900">
      {/* Video Area */}
      <div className="flex-1 relative bg-slate-800">
        {/* Main Video (Patient) */}
        <div className="absolute inset-0 flex items-center justify-center">
          {isCallActive ? (
            <div className="relative w-full h-full">
              {/* Simulated Video Feed */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                {isVideoOn ? (
                  <div className="text-center">
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mx-auto mb-4">
                      <User className="w-16 h-16 text-white" />
                    </div>
                    <p className="text-white text-lg font-medium">{patientName}</p>
                    <p className="text-slate-300 text-sm">Patient Video</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <VideoOff className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-400">Video Off</p>
                  </div>
                )}
              </div>

              {/* Doctor's Video (Picture-in-Picture) */}
              <div className="absolute bottom-4 right-4 w-48 h-36 bg-slate-700 rounded-lg border-2 border-white shadow-xl">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <Camera className="w-8 h-8 text-white mx-auto mb-2" />
                    <p className="text-white text-xs">You</p>
                  </div>
                </div>
              </div>

              {/* Call Info Overlay */}
              <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-lg">
                <p className="text-white text-sm font-medium">
                  🔴 Live Consultation
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Video className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-2">Call not started</p>
              <p className="text-slate-500 text-sm mb-6">Click "Start Call" to begin video consultation</p>
              <Button 
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => setIsCallActive(true)}
              >
                <Video className="w-5 h-5 mr-2" />
                Start Video Call
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Video Controls */}
      {isCallActive && (
        <div className="bg-slate-900 border-t border-slate-700 p-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={isAudioOn ? "secondary" : "destructive"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={() => setIsAudioOn(!isAudioOn)}
            >
              {isAudioOn ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>

            <Button
              variant={isVideoOn ? "secondary" : "destructive"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={() => setIsVideoOn(!isVideoOn)}
            >
              {isVideoOn ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>

            <Button
              variant="destructive"
              size="lg"
              className="rounded-full w-16 h-16"
              onClick={() => {
                setIsCallActive(false);
                setCallDuration(0);
              }}
            >
              <PhoneOff className="w-6 h-6" />
            </Button>

            <Button
              variant={isScreenSharing ? "default" : "secondary"}
              size="lg"
              className="rounded-full w-14 h-14"
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              {isScreenSharing ? <MonitorOff className="w-6 h-6" /> : <Monitor className="w-6 h-6" />}
            </Button>

            <Button
              variant="secondary"
              size="lg"
              className="rounded-full w-14 h-14"
            >
              <Settings className="w-6 h-6" />
            </Button>
          </div>

          {isScreenSharing && (
            <div className="mt-3 text-center">
              <Badge className="bg-green-600">
                <Monitor className="w-3 h-3 mr-1" />
                Screen Sharing Active
              </Badge>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
