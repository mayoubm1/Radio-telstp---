import { Loader2, FileAudio, FileText, Database, FolderOpen } from "lucide-react";

export default function Assets() {
  return (
    <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="p-6 rounded-full bg-secondary/50 border border-white/5 mb-6 animate-pulse">
        <Database className="w-12 h-12 text-muted-foreground" />
      </div>
      <h1 className="text-3xl font-display font-bold text-white mb-3">Asset Library</h1>
      <p className="text-muted-foreground max-w-md">
        Centralized storage for blueprints, audio files, and scripts. This module is currently offline for maintenance.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 w-full max-w-3xl">
        <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col items-center gap-3 opacity-50">
          <FileAudio className="w-8 h-8 text-blue-400" />
          <span className="font-mono text-sm">SFX REPOSITORY</span>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col items-center gap-3 opacity-50">
          <FileText className="w-8 h-8 text-purple-400" />
          <span className="font-mono text-sm">SCRIPTS & DOCS</span>
        </div>
        <div className="glass-panel p-6 rounded-xl border border-white/5 flex flex-col items-center gap-3 opacity-50">
          <FolderOpen className="w-8 h-8 text-orange-400" />
          <span className="font-mono text-sm">ARCHIVES</span>
        </div>
      </div>
    </div>
  );
}
