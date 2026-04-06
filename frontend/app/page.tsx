'use client';
import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/api/tasks';

type Task = {
  id: number;
  title: string;
  progress: number;
  completed: boolean;
};


const MenuIcon = () => (
  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskProgress, setNewTaskProgress] = useState(0);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch(API_URL);
      if(res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      console.error("Error fetching tasks:", e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!newTaskTitle.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTaskTitle,
          progress: newTaskProgress,
          completed: newTaskProgress === 100
        })
      });
      if(res.ok) {
        setNewTaskTitle('');
        setNewTaskProgress(0);
        setIsModalOpen(false);
        fetchTasks();
      }
    } catch (e) {
      console.error("Error creating task:", e);
    }
  };

  const handleToggleComplete = async (task: Task) => {
    try {
      const updatedCompleted = !task.completed;
      const res = await fetch(`${API_URL}/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, completed: updatedCompleted })
      });
      if(res.ok) {
        fetchTasks();
      }
    } catch(e) {
      console.error("Error updating task:", e);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      });
      if(res.ok) {
        fetchTasks();
      }
    } catch(e) {
      console.error("Error deleting task:", e);
    }
  };

  return (
    <>
      <header className="bg-indigo-500 pt-10 px-6 pb-20 rounded-b-[32px] relative z-10 shadow-[0_10px_20px_rgba(99,102,241,0.2)]">
        <div className="flex justify-between items-center text-white">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            
            Lista De Tareas
          </h1>
          <button 
            className="bg-white/20 backdrop-blur-md border border-white/30 py-2 px-4 rounded-full text-white font-semibold text-sm cursor-pointer flex items-center gap-1.5 transition-all duration-300 hover:bg-white/30 hover:-translate-y-0.5" 
            onClick={() => setIsModalOpen(true)}
          >
            + Nueva Tarea
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 pb-6 -mt-[50px] z-20 flex flex-col gap-4">
        {tasks.map(task => { 
          if (task.progress > 0 && !task.completed && task.progress < 100) {
            return (
              <div className="bg-[#252D40] border-amber-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm relative transition-transform duration-200 hover:-translate-y-0.5" key={task.id}>
                <div 
                  className="w-14 h-14 border-amber-200 rounded-full flex items-center justify-center relative after:content-[''] after:absolute after:w-12 after:h-12 after:bg-[#252D40] after:rounded-full" 
                  style={{ background: `conic-gradient(#10B981 ${task.progress}%, #334155 0%)` }}
                >
                  <span className="relative z-10 font-bold text-sm text-white">{task.progress}%</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold mt-[30px] mb-1">{task.title}</h3>
                  <p className="text-xs text-slate-400 leading-snug">Tarea En progreso</p>
                </div>
                <div className="flex flex-col gap-2 absolute -right-3">
                  <button 
                    className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer shadow transition-all duration-200 text-slate-400 bg-[#1C2333] hover:bg-red-500 hover:text-white" 
                    onClick={() => handleDelete(task.id)}
                  >
                    <TrashIcon />
                  </button>
                </div>
              </div>
            );
          }
   
          return (
            <div className="bg-[#252D40] rounded-xl border-amber-200 p-4 flex items-center gap-3 shadow-sm ml-5 relative before:content-[''] before:absolute before:-left-2.5 before:top-1/2 before:w-2.5 before:h-[2px] before:bg-slate-400/30" key={task.id}>
              <div 
                className={`w-6 h-6 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${task.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-400'}`}
                onClick={() => handleToggleComplete(task)}
              >
                <div className={`w-3.5 h-3.5 text-white transition-opacity duration-200 ${task.completed ? 'opacity-100' : 'opacity-0'}`}>
                  <CheckIcon />
                </div>
              </div>
              <span className={`flex-1 text-sm font-medium ${task.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                {task.title}
              </span>
              <button 
                className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer shadow transition-all duration-200 text-slate-400 bg-transparent hover:bg-red-500 hover:text-white" 
                onClick={() => handleDelete(task.id)}
              >
                <TrashIcon />
              </button>
            </div>
          );
        })}
        {tasks.length === 0 && (
          <div className="text-center algn text-white-400 mt-60">
            Ninguna tarea encontrada. Agrega una tarea
          </div>
        )}
      </main>

      {/* Modal Overlay */}
      <div className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-300 ${isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className={`bg-[#1C2333] p-6 rounded-2xl w-[90%] max-w-[380px] shadow-xl transition-all duration-300 ${isModalOpen ? 'translate-y-0' : 'translate-y-5'}`}>
          <h2 className="text-xl font-semibold mb-5 text-white">Crear Nueva Tarea</h2>
          <form onSubmit={handleCreateTask}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-slate-400">Nombre de la Tarea</label>
              <input 
                type="text" 
                value={newTaskTitle} 
                onChange={(e) => setNewTaskTitle(e.target.value)} 
                placeholder="Ingresar nombre..."
                className="w-full p-3 bg-[#252D40] border border-amber-200 rounded-xl text-white text-sm transition-colors duration-200 focus:outline-none focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-slate-400">Progreso (%) - 0 para tarea simple</label>
              <input 
                type="number" 
                min="0" max="100" 
                value={newTaskProgress} 
                onChange={(e) => setNewTaskProgress(Number(e.target.value))} 
                className="w-full p-3  bg-[#252D40] border border-amber-200 rounded-xl text-white text-sm transition-colors duration-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button 
                type="button" 
                className="bg-transparent text-slate-400 hover:bg-white/5 py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer border-none transition-all duration-200" 
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="bg-indigo-500 text-white hover:shadow-[0_4px_12px_rgba(99,102,241,0.4)] py-2.5 px-5 rounded-lg text-sm font-semibold cursor-pointer border-none transition-all duration-200"
              >
                Guardar Tarea
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
