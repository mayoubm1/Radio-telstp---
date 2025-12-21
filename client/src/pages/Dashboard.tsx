import { useDashboardStats } from "@/hooks/use-dashboard";
import { useTasks } from "@/hooks/use-tasks";
import { useEpisodes } from "@/hooks/use-episodes";
import { StatusBadge } from "@/components/StatusBadge";
import { Loader2, Film, CheckCircle2, ListTodo, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useDashboardStats();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { data: episodes, isLoading: episodesLoading } = useEpisodes();

  if (statsLoading || tasksLoading || episodesLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  const recentTasks = tasks?.slice(0, 5) || [];
  
  const pieData = [
    { name: 'Completed', value: stats?.completedEpisodes || 0, color: '#22c55e' },
    { name: 'In Progress', value: (stats?.totalEpisodes || 0) - (stats?.completedEpisodes || 0), color: '#0ea5e9' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 }
  };

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">Command Center</h1>
          <p className="text-muted-foreground font-mono">System Overview & Metrics</p>
        </div>
        <div className="text-right">
          <div className="text-sm font-mono text-primary animate-pulse">● LIVE DATA FEED</div>
          <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString()}</div>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard 
          icon={Film} 
          label="Total Episodes" 
          value={stats?.totalEpisodes || 0} 
          trend="+1 this week"
          color="text-blue-400"
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Completed" 
          value={stats?.completedEpisodes || 0} 
          trend="100% quality"
          color="text-green-400"
        />
        <StatCard 
          icon={ListTodo} 
          label="Active Tasks" 
          value={stats?.activeTasks || 0} 
          trend="High priority: 3"
          color="text-orange-400"
        />
        <StatCard 
          icon={Users} 
          label="Team Size" 
          value={stats?.teamSize || 0} 
          trend="AI Agents Active"
          color="text-purple-400"
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Feed */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="glass-panel rounded-xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-semibold">Recent Task Activity</h2>
              <Link href="/episodes" className="text-sm text-primary hover:underline font-mono flex items-center gap-1">
                VIEW ALL <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-white/5 hover:border-primary/30 transition-colors group">
                  <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'} shadow-[0_0_8px_currentColor]`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-white group-hover:text-primary transition-colors">{task.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground font-mono">
                        {task.episode ? task.episode.title : 'General'}
                      </span>
                      {task.assignee && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-white/70">
                          {task.assignee.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <StatusBadge status={task.status} size="sm" />
                </div>
              ))}
              
              {recentTasks.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  No active tasks found in the system.
                </div>
              )}
            </div>
          </div>

          {/* Episode Progress Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {episodes?.map((ep) => (
              <Link key={ep.id} href={`/episodes/${ep.id}`}>
                <div className="glass-panel p-5 rounded-xl hover:bg-card/90 transition-all cursor-pointer group border border-white/5 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(var(--primary),0.15)]">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-mono text-primary/80">EPISODE {ep.id}</span>
                    <StatusBadge status={ep.status} size="sm" />
                  </div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{ep.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{ep.theme}</p>
                  <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-primary h-full rounded-full" 
                      style={{ width: ep.status === 'completed' ? '100%' : ep.status === 'in_production' ? '60%' : '10%' }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Stats Column */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          <div className="glass-panel rounded-xl p-6 border border-white/5">
            <h2 className="text-xl font-display font-semibold mb-6">Completion Rate</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 text-sm font-mono mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" /> Completed
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-sky-500" /> In Progress
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-6 border border-white/5 bg-gradient-to-br from-primary/5 to-transparent">
            <h3 className="font-display font-bold text-lg mb-2 text-white">System Notifications</h3>
            <ul className="space-y-3 mt-4">
              <li className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary">•</span> Audio render completed for Ep 2
              </li>
              <li className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary">•</span> New script revision uploaded
              </li>
              <li className="text-sm text-muted-foreground flex gap-2">
                <span className="text-primary">•</span> Claude finished 3 tasks
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, color }: any) {
  return (
    <motion.div 
      variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}
      className="glass-panel p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-mono text-muted-foreground uppercase tracking-wide">{label}</p>
          <h3 className="text-4xl font-display font-bold mt-2 text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg bg-white/5 ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs font-mono text-green-400 bg-green-400/10 px-1.5 py-0.5 rounded">
          {trend}
        </span>
      </div>
    </motion.div>
  );
}
