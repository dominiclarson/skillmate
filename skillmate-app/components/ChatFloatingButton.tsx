'use client';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { useRouter } from 'next/navigation';

export function ChatFloatingButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push('/chat')}
      className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition">
      <IoChatbubblesOutline size={24} />
    </button>
  );
}