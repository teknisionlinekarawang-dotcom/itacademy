import ModuleLayout from '../components/ModuleLayout';
import MikrotikContent from './../materi/MikrotikContent';
import { BUILTIN_MODULES } from '../data/builtinModules';

const mikrotikModule = BUILTIN_MODULES.find(m => m.page === 'mikrotik-intro');

export default function MikrotikPage() {
  if (!mikrotikModule) {
    return <div>Module not found!</div>;
  }
  return (
    <ModuleLayout module={mikrotikModule}>
      <MikrotikContent />
    </ModuleLayout>
  );
}