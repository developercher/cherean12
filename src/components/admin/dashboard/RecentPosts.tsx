'use client';
import { formatDistanceToNow } from 'date-fns';

interface RecentPostsProps {
  posts: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    views: number;
  }>;
}

export default function RecentPosts({ posts }: RecentPostsProps) {
  if (!posts?.length) {
    return <div>No recent posts</div>;
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {posts.map((post) => (
        <div key={post.id} className="py-3 flex justify-between items-center">
          <div>
            <h3 className="text-sm font-medium">{post.title}</h3>
            <div className="flex items-center mt-1">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${post.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'}`}
              >
                {post.status}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {post.views} views
          </div>
        </div>
      ))}
    </div>
  );
} 