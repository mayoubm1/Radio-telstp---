import { useQuery } from "@tanstack/react-query";
import { Loader2, Music, Play, Pause, Clock } from "lucide-react";
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function DailyBroadcasts() {
  const { data: broadcasts, isLoading } = useQuery<any[]>({
    queryKey: ["/api/broadcasts"],
    queryFn: async () => {
      const res = await fetch("/api/broadcasts");
      if (!res.ok) throw new Error("Failed to fetch broadcasts");
      return res.json();
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-4xl font-display font-bold text-white mb-2">Daily Supportive Broadcasts</h1>
        <p className="text-muted-foreground">The "Tawasol" series and other essential transmissions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {broadcasts?.map((broadcast, index) => (
          <BroadcastCard key={broadcast.id} broadcast={broadcast} index={index} />
        ))}
      </div>
    </div>
  );
}

function BroadcastCard({ broadcast, index }: { broadcast: any, index: number }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="glass-panel border-white/10 hover:border-primary/40 transition-all">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-mono text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">
              {broadcast.type}
            </span>
            <Music className="w-4 h-4 text-muted-foreground" />
          </div>
          <CardTitle className="text-lg font-display mt-2">{broadcast.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mt-4">
            <audio 
              ref={audioRef} 
              src={broadcast.audioUrl} 
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            />
            <Button 
              onClick={togglePlay}
              variant={isPlaying ? "secondary" : "default"}
              className="w-full"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? "PAUSE" : "PLAY BROADCAST"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
