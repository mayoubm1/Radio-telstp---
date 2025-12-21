import { useTeam, useCreateTeamMember } from "@/hooks/use-team";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTeamMemberSchema } from "@shared/schema";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Bot, User, BrainCircuit, Sparkles, Mic2, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Team() {
  const { data: team, isLoading } = useTeam();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // Group team members by category
  const categories = {
    "Content Architecture": team?.filter(m => m.category === "Content Architecture") || [],
    "Audio Production": team?.filter(m => m.category === "Audio Production") || [],
    "QA": team?.filter(m => m.category === "QA") || [],
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Team Roster</h1>
          <p className="text-muted-foreground font-mono mt-2">AI Agents & Human Operators</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-[0_0_15px_rgba(var(--primary),0.3)]">
              <Plus className="w-4 h-4 mr-2" /> ADD MEMBER
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-card border-border sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="font-display text-xl">Onboard New Member</DialogTitle>
            </DialogHeader>
            <CreateTeamMemberForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-12">
        {Object.entries(categories).map(([category, members]) => (
          members.length > 0 && (
            <div key={category}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-display font-semibold text-white/90 uppercase tracking-widest">{category}</h2>
                <div className="h-[1px] flex-1 bg-gradient-to-r from-white/20 to-transparent" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                  <TeamCard key={member.id} member={member} />
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
}

function TeamCard({ member }: { member: any }) {
  const getIcon = () => {
    if (member.role.includes("Sound") || member.role.includes("Audio")) return <Mic2 className="w-5 h-5 text-blue-400" />;
    if (member.role.includes("QA") || member.role.includes("Critic")) return <ShieldCheck className="w-5 h-5 text-green-400" />;
    if (member.role.includes("Creative") || member.role.includes("Idea")) return <Sparkles className="w-5 h-5 text-purple-400" />;
    return <BrainCircuit className="w-5 h-5 text-primary" />;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="glass-panel p-6 rounded-xl border border-white/5 relative overflow-hidden group hover:border-primary/30 transition-all duration-300"
    >
      <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity">
        {member.isAi ? <Bot className="w-5 h-5 text-primary" /> : <User className="w-5 h-5 text-orange-400" />}
      </div>
      
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
          {getIcon()}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{member.name}</h3>
          <p className="text-sm text-muted-foreground font-mono mt-1">{member.role}</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse" />
          <span className="text-xs font-mono text-green-500 uppercase">Online</span>
        </div>
        <span className="text-xs text-white/30 font-mono">ID: {member.id.toString().padStart(4, '0')}</span>
      </div>
    </motion.div>
  );
}

function CreateTeamMemberForm({ onSuccess }: { onSuccess: () => void }) {
  const { mutate, isPending } = useCreateTeamMember();
  const form = useForm<z.infer<typeof insertTeamMemberSchema>>({
    resolver: zodResolver(insertTeamMemberSchema),
    defaultValues: {
      isAi: true
    }
  });

  const onSubmit = (data: z.infer<typeof insertTeamMemberSchema>) => {
    mutate(data, { onSuccess });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs font-mono uppercase">Agent Name</Label>
        <Input 
          id="name" 
          {...form.register("name")} 
          className="bg-secondary/50 border-white/10 focus:border-primary/50" 
          placeholder="e.g. Claude 3.5 Sonnet" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role" className="text-xs font-mono uppercase">Role / Function</Label>
        <Input 
          id="role" 
          {...form.register("role")} 
          className="bg-secondary/50 border-white/10 focus:border-primary/50" 
          placeholder="e.g. Strategic Planning" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-xs font-mono uppercase">Department</Label>
        <Select onValueChange={(val) => form.setValue("category", val)}>
          <SelectTrigger className="bg-secondary/50 border-white/10 focus:border-primary/50">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Content Architecture">Content Architecture</SelectItem>
            <SelectItem value="Audio Production">Audio Production</SelectItem>
            <SelectItem value="QA">Quality Assurance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between p-3 rounded bg-secondary/30 border border-white/5">
        <div className="space-y-0.5">
          <Label className="text-base">AI Agent</Label>
          <div className="text-xs text-muted-foreground">Is this an artificial intelligence?</div>
        </div>
        <Switch 
          checked={form.watch("isAi")}
          onCheckedChange={(checked) => form.setValue("isAi", checked)}
        />
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onSuccess}>Cancel</Button>
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold min-w-[120px]"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ONBOARD"}
        </Button>
      </div>
    </form>
  );
}
