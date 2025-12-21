import { useEpisode } from "@/hooks/use-episodes";
import { useCreateTask, useUpdateTask } from "@/hooks/use-tasks";
import { useTeam } from "@/hooks/use-team";
import { useRoute, Link } from "wouter";
import { Loader2, ArrowLeft, Plus, Calendar, User, CheckCircle2, Circle, Clock } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTaskSchema } from "@shared/schema";
import { z } from "zod";
import { useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export default function EpisodeDetails() {
  const [match, params] = useRoute("/episodes/:id");
  const id = params ? parseInt(params.id) : 0;
  const { data: episode, isLoading } = useEpisode(id);
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-white">Episode Not Found</h2>
        <Link href="/episodes" className="text-primary hover:underline mt-4 inline-block">Return to List</Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <Link href="/episodes">
        <div className="inline-flex items-center text-muted-foreground hover:text-white mb-4 transition-colors cursor-pointer group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          <span className="font-mono text-sm">BACK TO FLEET</span>
        </div>
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-white/10 pb-8">
        <div>
          <div className="flex items-center gap-4 mb-3">
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
              EPISODE 0{episode.id}
            </span>
            <StatusBadge status={episode.status} />
          </div>
          <h1 className="text-4xl font-display font-bold text-white mb-3">{episode.title}</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">{episode.theme}</p>
        </div>

        <div className="flex gap-4">
          <div className="glass-panel p-4 rounded-lg border border-white/5 text-center min-w-[120px]">
            <div className="text-xs text-muted-foreground font-mono uppercase mb-1">Assets</div>
            <div className="text-2xl font-display font-bold text-white">{episode.assets?.length || 0}</div>
          </div>
          <div className="glass-panel p-4 rounded-lg border border-white/5 text-center min-w-[120px]">
            <div className="text-xs text-muted-foreground font-mono uppercase mb-1">Tasks</div>
            <div className="text-2xl font-display font-bold text-white">{episode.tasks?.length || 0}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Tasks */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-display font-bold text-white">Production Tasks</h2>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-secondary hover:bg-secondary/80 text-white border border-white/10">
                  <Plus className="w-4 h-4 mr-2" /> ADD TASK
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border">
                <DialogHeader>
                  <DialogTitle>Add Production Task</DialogTitle>
                </DialogHeader>
                <CreateTaskForm episodeId={id} onSuccess={() => setOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-3">
            {episode.tasks?.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-white/10 rounded-xl text-muted-foreground font-mono">
                NO TASKS INITIALIZED
              </div>
            ) : (
              episode.tasks?.map((task) => (
                <TaskItem key={task.id} task={task} />
              ))
            )}
          </div>
        </div>

        {/* Sidebar - Details */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-400" /> SFX Requirements
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {episode.sfxRequirements || "No specific requirements logged."}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <h3 className="font-display font-bold text-white mb-4 flex items-center gap-2">
              <Music2 className="w-4 h-4 text-blue-400" /> Ambience Goals
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {episode.ambienceGoals || "No ambience goals defined."}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-white/5">
            <h3 className="font-display font-bold text-white mb-4">Emotional Arc</h3>
            <div className="p-3 bg-secondary/50 rounded-lg border border-white/5 text-sm text-white/80 font-mono">
              {episode.emotionalArc || "TBD"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskItem({ task }: { task: any }) {
  const { mutate } = useUpdateTask();

  const toggleStatus = () => {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    mutate({ id: task.id, status: newStatus });
  };

  return (
    <motion.div 
      layout
      className={clsx(
        "group flex items-center gap-4 p-4 rounded-lg border transition-all duration-200",
        task.status === "completed" 
          ? "bg-secondary/20 border-white/5 opacity-60" 
          : "bg-secondary/50 border-white/10 hover:border-primary/30"
      )}
    >
      <button 
        onClick={toggleStatus}
        className={clsx(
          "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
          task.status === "completed" 
            ? "bg-green-500/20 border-green-500 text-green-500" 
            : "border-white/20 text-transparent hover:border-primary"
        )}
      >
        <CheckCircle2 className="w-3.5 h-3.5" />
      </button>

      <div className="flex-1 min-w-0">
        <h4 className={clsx("font-medium truncate", task.status === "completed" && "line-through text-muted-foreground")}>
          {task.title}
        </h4>
        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
          {task.assignee && (
            <span className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded text-white/70">
              <User className="w-3 h-3" /> {task.assignee.name}
            </span>
          )}
          <span className={clsx(
            "uppercase font-mono",
            task.priority === "high" ? "text-red-400" : task.priority === "medium" ? "text-orange-400" : "text-blue-400"
          )}>
            {task.priority} Priority
          </span>
        </div>
      </div>

      <StatusBadge status={task.status} size="sm" />
    </motion.div>
  );
}

function CreateTaskForm({ episodeId, onSuccess }: { episodeId: number, onSuccess: () => void }) {
  const { mutate, isPending } = useCreateTask();
  const { data: team } = useTeam();
  
  const form = useForm<z.infer<typeof insertTaskSchema>>({
    resolver: zodResolver(insertTaskSchema),
    defaultValues: {
      episodeId,
      status: "pending",
      priority: "medium"
    }
  });

  const onSubmit = (data: z.infer<typeof insertTaskSchema>) => {
    mutate(data, { onSuccess });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="title">Task Description</Label>
        <Input 
          id="title" 
          {...form.register("title")} 
          className="bg-secondary/50 border-white/10 focus:border-primary/50" 
          placeholder="What needs to be done?" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Assignee</Label>
          <Select onValueChange={(val) => form.setValue("assignedToId", parseInt(val))}>
            <SelectTrigger className="bg-secondary/50 border-white/10 focus:border-primary/50">
              <SelectValue placeholder="Unassigned" />
            </SelectTrigger>
            <SelectContent>
              {team?.map((member) => (
                <SelectItem key={member.id} value={member.id.toString()}>
                  {member.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Priority</Label>
          <Select 
            defaultValue="medium" 
            onValueChange={(val: any) => form.setValue("priority", val)}
          >
            <SelectTrigger className="bg-secondary/50 border-white/10 focus:border-primary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="pt-4 flex justify-end gap-3">
        <Button type="button" variant="ghost" onClick={onSuccess}>Cancel</Button>
        <Button 
          type="submit" 
          disabled={isPending}
          className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
        >
          {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "ADD TASK"}
        </Button>
      </div>
    </form>
  );
}
