import { create } from 'zustand';

export const useFeedStore = create((set) => ({
  posts: JSON.parse(localStorage.getItem('society_posts') || '[]'),
  
  addPost: (post) => set((state) => {
    const newPost = {
      id: Date.now().toString(),
      time: 'Just now',
      likes: 0,
      comments: 0,
      trending: false,
      sentiment: 'Neutral',
      ...post
    };
    const newPosts = [newPost, ...state.posts];
    localStorage.setItem('society_posts', JSON.stringify(newPosts));
    return { posts: newPosts };
  }),

  likePost: (id) => set((state) => {
    const newPosts = state.posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
    localStorage.setItem('society_posts', JSON.stringify(newPosts));
    return { posts: newPosts };
  })
}));

// Initialize with some seed data if empty
if (useFeedStore.getState().posts.length === 0) {
  useFeedStore.getState().addPost({
    author: 'Aarav Mehta',
    unit: 'C-804',
    content: 'Just wanted to share how beautiful the garden looks today after the morning rain! 🌿 Kudos to the maintenance team.',
    image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=800&auto=format&fit=crop',
    likes: 24,
    comments: 5,
    trending: true,
    sentiment: 'Positive'
  });
  useFeedStore.getState().addPost({
    author: 'Priya Sharma',
    unit: 'A-201',
    content: 'Lost my keys near the clubhouse today. If anyone finds them, please drop them at the gate. Thanks!',
    likes: 8,
    comments: 12,
    sentiment: 'Neutral'
  });
}
