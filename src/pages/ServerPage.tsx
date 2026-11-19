import ModuleLayout from '../components/ModuleLayout';
import ServerContent from '../materi/ServerContent';
import { BUILTIN_MODULES } from '../data/builtinModules';

const serverModule = BUILTIN_MODULES.find(m => m.page === 'server');

export default function ServerPage() {
  if (!serverModule) {
    return <div>Module not found!</div>;
  }
  return (
    <ModuleLayout module={serverModule}>
      <ServerContent />
    </ModuleLayout>
  );
}
