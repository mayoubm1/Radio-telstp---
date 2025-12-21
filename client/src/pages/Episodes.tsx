import { useEpisodes, useCreateEpisode } from "@/hooks/use-episodes";
import { Link } from "wouter";
import { Plus, ArrowUpRight, Film, Radio, Music2, Wand2, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEpisodeSchema } from "@shared/schema";
import { z } from "zod";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Episodes() {
  const { data: episodes, isLoading } = useEpisodes();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Episodes</h1>
          <p className="text-muted-foreground font-mono mt-2">Production Pipeline & Status</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_15px_rgba(var(--primary),0.3)]">
              <Plus className="w-4 h-4 mr-2" /> NEW EPISODE
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Initialize New Episode</DialogTitle>
            </DialogHeader>
            <CreateEpisodeForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {episodes?.map((episode, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={episode.id}
          >
            <Link href={`/episodes/${episode.id}`}>
              <div className="group relative bg-card/50 hover:bg-card border border-white/5 hover:border-primary/50 rounded-xl p-6 transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-[0_0_30px_rgba(var(--primary),0.1)]">
                
                {/* Background Grid Effect */}
                <div className="absolute inset-0 sci-fi-grid opacity-20 pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row gap-8">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
                        EPISODE 0{episode.id}
                      </span>
                      <StatusBadge status={episode.status} />
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-display font-bold text-white group-hover:text-primary transition-colors mb-2">
                        {episode.title}
                      </h2>
                      <p className="text-lg text-muted-foreground">{episode.theme}</p>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4">
                      {episode.sfxRequirements && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                          <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                          <span className="truncate max-w-[200px]">{episode.sfxRequirements}</span>
                        </div>
                      )}
                      {episode.ambienceGoals && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                          <Music2 className="w-3.5 h-3.5 text-blue-400" />
                          <span className="truncate max-w-[200px]">{episode.ambienceGoals}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end min-w-[140px]">
                    <div className="p-3 rounded-full bg-secondary border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                      <ArrowUpRight className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="text-xs font-mono text-muted-foreground mt-4">
                      CREATED: {new Date(episode.createdAt!).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function CreateEpisodeForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate, isPending } = useCreateEpisode();
  const form = useForm<z.infer<typeof insertEpisodeSchema>>({
    resolver: zodResolver(insertEpisodeSchema),
    defaultValues: {
      status: "planning"
    }
  });

  const onSubmit = (data: z.infer<typeof insertEpisodeSchema>) => {
    mutate(data, { onSuccess });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="title" className="text-xs font-mono uppercase">Episode Title</Label>
        <Input 
          id="title" 
          {...form.register("title")} 
          className="bg-secondary/50 border-white/10 focus:border-primary/50 font-display" 
          placeholder="e.g. Echoes of the Void" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="theme" className="text-xs font-mono uppercase">Core Theme</Label>
        <Input 
          id="theme" 
          {...form.register("theme")} 
          className="bg-secondary/50 border-white/10 focus:border-primary/50" 
          placeholder="Main thematic concept..." 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sfx" className="text-xs font-mono uppercase">SFX Requirements</Label>
          <Textarea 
            id="sfx" 
            {...form.register("sfxRequirements")} 
            className="bg-secondary/50 border-white/10 focus:border-primary/50 min-h-[100px]" 
            placeholder="Specific sounds needed..." 
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ambience" className="text-xs font-mono uppercase">Ambience Goals</Label>
          <Textarea 
            id="ambience" 
            {...form.register("ambienceGoals")} 
            className="bg-secondary/50 border-white/10 focus:border-primary/50 min-h-[100px]" 
            placeholder="Mood and atmosphere..." 
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="arc" className="text-xs font-mono uppercase">Emotional Arc</Label>
        <Input 
          id="arc" 
          {...form.register("emotionalArc")} 
          className="bg-secondary/50 border-white/10 focus:border-primary/50" 
          placeholder="Beginning to end emotion..." 
        />
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onSuccess}>Cancel</Button>
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold min-w-[120px]"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "INITIATE"}
        </Button>
      </div>
    </form>
  );
}
