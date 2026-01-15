import { useEffect, useRef, useState } from "react";
import AgoraRTC, { IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack } from "agora-rtc-sdk-ng";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Radio, Mic, MicOff, Video, VideoOff, Play } from "lucide-react";

interface AgoraBroadcastProps {
  appId: string;
  channel: string;
  token: string;
}

export function AgoraBroadcast({ channel }: { channel: string }) {
  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [config, setConfig] = useState<{ appId: string; token: string } | null>(null);
  
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const localAudioTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const localVideoTrackRef = useRef<ICameraVideoTrack | null>(null);
  const videoElementRef = useRef<HTMLDivElement>(null);

  const fetchToken = async () => {
    try {
      const res = await fetch("/api/agora/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelName: channel, role: "publisher" })
      });
      const data = await res.json();
      if (data.token) {
        setConfig(data);
        return data;
      }
    } catch (error) {
      console.error("Token fetch error:", error);
    }
    return null;
  };

  const joinChannel = async () => {
    const currentConfig = config || await fetchToken();
    if (!currentConfig || !clientRef.current) return;
    
    try {
      await clientRef.current.setClientRole("host");
      await clientRef.current.join(currentConfig.appId, channel, currentConfig.token, 0);
      
      localAudioTrackRef.current = await AgoraRTC.createMicrophoneAudioTrack();
      localVideoTrackRef.current = await AgoraRTC.createCameraVideoTrack();
      
      if (videoElementRef.current) {
        localVideoTrackRef.current.play(videoElementRef.current);
      }
      
      await clientRef.current.publish([localAudioTrackRef.current, localVideoTrackRef.current]);
      setJoined(true);
    } catch (error) {
      console.error("Agora Join Error:", error);
    }
  };

  const leaveChannel = async () => {
    localAudioTrackRef.current?.close();
    localVideoTrackRef.current?.close();
    if (clientRef.current) {
      await clientRef.current.leave();
    }
    setJoined(false);
  };

  const toggleMic = async () => {
    if (localAudioTrackRef.current) {
      await localAudioTrackRef.current.setEnabled(!micOn);
      setMicOn(!micOn);
    }
  };

  const toggleVideo = async () => {
    if (localVideoTrackRef.current) {
      await localVideoTrackRef.current.setEnabled(!videoOn);
      setVideoOn(!videoOn);
    }
  };

  return (
    <Card className="border-cyan-500/30 bg-black/40 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-cyan-400">Live Broadcast - {channel}</CardTitle>
        <Radio className={`h-4 w-4 ${joined ? "text-red-500 animate-pulse" : "text-muted-foreground"}`} />
      </CardHeader>
      <CardContent>
        <div 
          ref={videoElementRef} 
          className="aspect-video w-full rounded-md bg-slate-900 mb-4 overflow-hidden border border-cyan-500/20"
        />
        <div className="flex gap-2 justify-center">
          {!joined ? (
            <Button onClick={joinChannel} className="bg-cyan-600 hover:bg-cyan-700">
              <Play className="mr-2 h-4 w-4" /> Go Live
            </Button>
          ) : (
            <>
              <Button variant="outline" size="icon" onClick={toggleMic} className="border-cyan-500/30">
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4 text-red-500" />}
              </Button>
              <Button variant="outline" size="icon" onClick={toggleVideo} className="border-cyan-500/30">
                {videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4 text-red-500" />}
              </Button>
              <Button variant="destructive" onClick={leaveChannel}>
                Stop
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
