import ModuleLayout from '../components/ModuleLayout';
import CyberSecurityContent from '../materi/CyberSecurityContent';
import { BUILTIN_MODULES } from '../data/builtinModules';

const cyberSecurityModule = BUILTIN_MODULES.find(m => m.page === 'cyber-security');

export default function CyberSecurityPage() {
  if (!cyberSecurityModule) {
    return <div>Module not found!</div>;
  }
  return (
    <ModuleLayout module={cyberSecurityModule}>
      <CyberSecurityContent />
    </ModuleLayout>
  );
}
