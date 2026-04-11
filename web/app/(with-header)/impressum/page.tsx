import { Markdown } from '@/components/markdown';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Aviso Legal',
  description: 'Datos de contacto de votamos.chat',
  robots: 'noindex',
};

function Impressum() {
  const markdown = `
# Aviso Legal
        
## Dirección
*Simón Karan*  
Carrera 14 #127A-85 
Bogotá 
Colombia

## Kontakt
**E-Mail:** info@votamos.chat
  `;

  return (
    <div className="mx-auto w-full">
      <Markdown onReferenceClick={() => {}}>{markdown}</Markdown>
    </div>
  );
}

export default Impressum;
