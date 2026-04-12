import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { postAPI } from '../api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Image, 
  Send, 
  Flame, 
  Sparkles, 
  TrendingUp, 
  Smile, 
  AlertCircle,
  BrainCircuit
} from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_POSTS } from '../data/mockData';

export default function SocietyFeed() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [postText, setPostText] = useState('');

  const { data: realPostsRes, isLoading } = useQuery({
    queryKey: ['society-posts'],
    queryFn: async () => {
      const res = await postAPI.getAll();
      return res.data.posts;
    }
  });

  // Combine Real + Mock and sort by date
  const posts = [
    ...(realPostsRes || []),
    ...MOCK_POSTS
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const postMutation = useMutation({
    mutationFn: (data) => postAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['society-posts']);
      toast.success('Post shared with the community!');
      setPostText('');
    },
    onError: () => toast.error('Failed to share post')
  });

  const likeMutation = useMutation({
    mutationFn: (id) => postAPI.like(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['society-posts']);
    }
  });

  const handlePost = () => {
    if (!postText.trim()) return;
    postMutation.mutate({ content: postText });
  };

  return (
    <div className="p-4 md:p-6 space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-2">
               Society Feed <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </h1>
            <p className="text-muted-foreground text-sm font-medium uppercase tracking-widest text-[10px]">Real-time community activity</p>
         </div>
         <div className="flex items-center gap-4 bg-muted/50 p-2 rounded-xl border">
            <div className="flex items-center gap-1 text-orange-500 font-black text-xs px-3">
               <Flame className="h-4 w-4 fill-current" /> {posts.length + 5} ACTIVE
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2 text-emerald-600 font-black text-xs px-3">
               <Smile className="h-4 w-4" /> 92% POSITIVE MOOD
            </div>
         </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Column: Feed */}
        <div className="lg:col-span-8 space-y-8">
          {/* Post Creation */}
          <Card className="shadow-2xl border-primary/20 overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-2 opacity-50">
               <BrainCircuit className="h-10 w-10 text-primary/10" />
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="flex gap-4">
                <Avatar className="h-12 w-12 border-2 border-primary/20 flex items-center justify-center bg-primary/10 font-bold text-primary">
                  {user?.name?.charAt(0)}
                </Avatar>
                <div className="flex-1 space-y-4">
                   <div className="bg-muted/30 rounded-2xl p-4 border-2 border-dashed border-primary/10 hover:border-primary/30 transition-all">
                      <textarea 
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        placeholder={`Share something with your neighbors, ${user?.name?.split(' ')[0]}...`}
                        className="w-full bg-transparent border-none focus:ring-0 text-sm font-medium resize-none h-24 placeholder:text-muted-foreground/60"
                        disabled={postMutation.isPending}
                      />
                   </div>
                   <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                         <Button variant="outline" size="sm" className="rounded-full gap-2 border-dashed border-primary/20 text-xs font-bold px-4">
                            <Image className="h-4 w-4 text-primary" /> Add Photo
                         </Button>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-[10px] font-black text-muted-foreground uppercase hidden sm:block">AI Moderation Active</span>
                         <Button onClick={handlePost} disabled={!postText.trim() || postMutation.isPending} className="rounded-full px-6 font-black shadow-xl shadow-primary/20">
                            {postMutation.isPending ? 'Syncing...' : 'Post'} <Send className="h-3.5 w-3.5 ml-2" />
                         </Button>
                      </div>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feed List */}
          <div className="space-y-6">
            {posts.map((post) => (
              <Card key={post._id} className="shadow-lg hover:shadow-2xl transition-all border-none group relative overflow-hidden bg-white/50 backdrop-blur-sm">
                 <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
                 
                 {(post.trending || post.likes?.length > 5) && (
                    <div className="absolute top-4 right-4 bg-orange-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-10 flex items-center gap-1.5 animate-bounce">
                       <TrendingUp className="h-3 w-3" /> VIRAL TOPIC
                    </div>
                 )}
                 
                 <CardHeader className="flex flex-row items-center gap-4 pb-3">
                    <Avatar className="h-12 w-12 ring-2 ring-primary/10 group-hover:ring-primary/40 transition-all flex items-center justify-center bg-muted font-bold text-lg">
                       {(post.author?.name || 'User').charAt(0)}
                    </Avatar>
                    <div className="flex-1">
                       <div className="flex items-center gap-2">
                          <h4 className="font-black text-base">{post.author?.name}</h4>
                          <div className="bg-primary/5 px-2 py-0.5 rounded-md text-[10px] font-black text-primary uppercase">Unit {post.author?.unit || 'SOC'}</div>
                       </div>
                       <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">{formatDistanceToNow(new Date(post.createdAt))} ago</p>
                    </div>
                 </CardHeader>
                 
                 <CardContent className="space-y-4 px-6">
                    <p className="text-sm font-medium leading-relaxed text-foreground/90 whitespace-pre-wrap">{post.content}</p>
                    {post.image && (
                       <div className="rounded-2xl overflow-hidden border-2 border-muted shadow-inner">
                          <img src={post.image} alt="Post Attachment" className="w-full object-cover max-h-[400px] hover:scale-105 transition-transform duration-700" />
                       </div>
                    )}
                 </CardContent>
                 
                 <CardFooter className="pt-2 flex justify-between px-6 pb-4">
                    <div className="flex gap-4">
                       <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 font-bold" onClick={() => likeMutation.mutate(post._id)}>
                          <Heart className={`h-4 w-4 ${post.likes?.includes(user?._id) ? 'fill-red-500 text-red-500' : ''}`} /> {post.likes?.length || 0}
                       </Button>
                       <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 font-bold">
                          <MessageCircle className="h-4 w-4" /> 0
                       </Button>
                    </div>
                    <Badge variant="outline" className={`text-[9px] font-black uppercase ${post.sentiment === 'Positive' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : post.sentiment === 'Negative' ? 'text-red-600 border-red-200 bg-red-50' : ''}`}>
                       AI: {post.sentiment || 'Analyzing'}
                    </Badge>
                 </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: AI Insights */}
        <div className="lg:col-span-4 space-y-6">
           <Card className="bg-primary text-primary-foreground border-none shadow-2xl relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 bg-white/10 w-32 h-32 rounded-full blur-2xl" />
              <CardHeader>
                 <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5" /> AI Community Analyst
                 </CardTitle>
                 <CardDescription className="text-primary-foreground/70">Autonomous insights from the feed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest opacity-80">🔥 Rising Topics</p>
                    <div className="flex flex-wrap gap-2">
                       {['#GardenSafety', '#MorningRain', '#KeyRegistry', '#SocietyGlow'].map((tag, i) => (
                          <Badge key={i} className="bg-white/20 text-white hover:bg-white/30 border-none px-3 font-bold">{tag}</Badge>
                       ))}
                    </div>
                 </div>

                 <div className="bg-black/20 p-4 rounded-xl space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase">
                       <span>Community Sentiment</span>
                       <Smile className="h-3 w-3" />
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-400 w-[92%] shadow-[0_0_10px_#34d399]" />
                    </div>
                 </div>

                 <div className="space-y-3">
                    <p className="text-xs font-black uppercase tracking-widest opacity-80">🤖 Smart Summary</p>
                    <div className="bg-white/10 p-3 rounded-lg text-xs leading-relaxed font-medium italic">
                       "Residents are showing high appreciation for the landscaping team. Engagement is up 12% in the last 24 hours."
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="shadow-lg border-primary/10">
              <CardHeader className="pb-2">
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" /> AI Auto-Mod
                 </CardTitle>
              </CardHeader>
              <CardContent className="text-xs font-medium text-muted-foreground leading-relaxed">
                 AI is monitoring the feed for toxicity, spam, and PII. 0 flags in the last 24 hours. Keep it friendly!
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
