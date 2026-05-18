'use client'

import { useMessages } from '@/hooks'

export default function MessagesPage() {
  const { messages, loading } = useMessages()

  if (loading) return <p className="text-sm text-gray-400">იტვირთება...</p>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold">შეტყობინებები ({messages.length})</h2>
      </div>
      {messages.length === 0 ? (
        <p className="text-sm text-gray-400">შეტყობინებები არ არის</p>
      ) : (
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className="p-4 rounded-xl bg-[#111111] border border-[#2a2a2a]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-sm">{m.name}</div>
                  <div className="text-xs text-[#a8d941] mt-1">{m.phone}</div>
                  {m.interest && (
                    <span className="inline-block mt-2 px-2 py-1 rounded bg-[#1a1a1a] text-xs text-gray-300">
                      {m.interest === 'personal' ? 'პერსონალური ტრენინგი' : m.interest === 'group' ? 'ჯგუფური ვარჯიში' : m.interest === 'membership' ? 'აბონემენტი' : m.interest}
                    </span>
                  )}
                  {m.message && <p className="mt-3 text-sm text-gray-300">{m.message}</p>}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {new Date(m.created_at).toLocaleDateString('ka-GE')}<br/>
                  {new Date(m.created_at).toLocaleTimeString('ka-GE', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
