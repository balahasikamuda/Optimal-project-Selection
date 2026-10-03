import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/layout/Navbar';
import { DashboardTab } from './components/dashboard/DashboardTab';
import { ProjectListTab } from './components/projects/ProjectListTab';
import { OptimizerTab } from './components/optimizer/OptimizerTab';
import { AnalyticsTab } from './components/analytics/AnalyticsTab';
import { ProjectModal } from './components/projects/ProjectModal';
import { INITIAL_PROJECTS, DEFAULT_BUDGET, DEFAULT_MAX_PROJECTS } from './data/sampleProjects';
import { Project, CalculatedProject, ActiveTab } from './types';
import { evaluateProjectMetrics } from './utils/financialEngine';
import { solve01Knapsack } from './utils/knapsackOptimizer';
import { CheckCircle2, Info, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  // 1. Persistent State
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const saved = localStorage.getItem('investoptima_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e);
    }
    return INITIAL_PROJECTS;
  });

  const [budget, setBudget] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('investoptima_budget');
      if (saved) {
        const parsed = Number(saved);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load budget from localStorage:', e);
    }
    return DEFAULT_BUDGET;
  });

  const [maxProjects, setMaxProjects] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('investoptima_max_projects');
      if (saved) {
        const parsed = Number(saved);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load max projects from localStorage:', e);
    }
    return DEFAULT_MAX_PROJECTS; // 3 projects default limit
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('investoptima_projects', JSON.stringify(projects));
    } catch (e) {
      console.error(e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('investoptima_budget', budget.toString());
    } catch (e) {
      console.error(e);
    }
  }, [budget]);

  useEffect(() => {
    try {
      localStorage.setItem('investoptima_max_projects', maxProjects.toString());
    } catch (e) {
      console.error(e);
    }
  }, [maxProjects]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
  };

  // 2. Evaluated Projects with Financial Metrics
  const calculatedProjects: CalculatedProject[] = useMemo(() => {
    return projects.map(p => ({
      ...p,
      metrics: evaluateProjectMetrics(p)
    }));
  }, [projects]);

  // 3. Dual-Constrained Knapsack Optimization Result
  const optimizationResult = useMemo(() => {
    return solve01Knapsack(calculatedProjects, budget, maxProjects);
  }, [calculatedProjects, budget, maxProjects]);

  const selectedIdsSet = useMemo(() => {
    return new Set(optimizationResult.selectedProjects.map(p => p.id));
  }, [optimizationResult]);

  // Handlers
  const handleSaveProject = (savedProject: Project) => {
    const exists = projects.some(p => p.id === savedProject.id);
    if (exists) {
      setProjects(projects.map(p => p.id === savedProject.id ? savedProject : p));
      showToast(`Updated "${savedProject.name}" successfully!`, 'success');
    } else {
      setProjects([savedProject, ...projects]);
      showToast(`Added new project "${savedProject.name}" to evaluation pool!`, 'success');
    }
    setEditingProject(null);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleDeleteProject = (projectId: string) => {
    const proj = projects.find(p => p.id === projectId);
    setProjects(projects.filter(p => p.id !== projectId));
    showToast(`Removed "${proj?.name || 'Project'}" from evaluation list.`, 'info');
  };

  const handleResetData = () => {
    setProjects(INITIAL_PROJECTS);
    setBudget(DEFAULT_BUDGET);
    setMaxProjects(DEFAULT_MAX_PROJECTS);
    showToast('Reset to demo project dataset with ₹5,00,000 budget and 3 project limit.', 'info');
  };

  const handleOpenAddModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
        projectCount={projects.length}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardTab
            projects={calculatedProjects}
            result={optimizationResult}
            budget={budget}
            maxProjects={maxProjects}
            setActiveTab={setActiveTab}
            onAddProject={handleOpenAddModal}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectListTab
            projects={calculatedProjects}
            onAddProject={handleOpenAddModal}
            onEditProject={handleEditProject}
            onDeleteProject={handleDeleteProject}
            selectedIdsInOptimizer={selectedIdsSet}
          />
        )}

        {activeTab === 'optimizer' && (
          <OptimizerTab
            budget={budget}
            setBudget={setBudget}
            maxProjects={maxProjects}
            setMaxProjects={setMaxProjects}
            availableProjectsCount={projects.length}
            result={optimizationResult}
            allProjects={calculatedProjects}
            onTriggerOptimize={() => showToast('Optimal project selection recalculated successfully.', 'success')}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab
            projects={calculatedProjects}
            result={optimizationResult}
          />
        )}
      </main>

      {/* Add / Edit Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
        initialProject={editingProject}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md bg-slate-900/95 border border-slate-700 text-sm font-medium animate-bounce-short">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
          {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span className="text-white">{toast.message}</span>
        </div>
      )}

      {/* Clean Corporate Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <strong className="text-slate-300 font-semibold">InvestOptima</strong> — Smart Investment Project Selection System
          </div>
          <div className="flex items-center space-x-4 text-slate-400">
            <span>Capital Budgeting & Portfolio Selection</span>
            <span>&bull;</span>
            <span>Client-Side Analytics Engine</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
