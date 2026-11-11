import BusinessApp from '@/components/BusinessApp';import {sections} from '@/lib/ui-config';import {notFound} from 'next/navigation';
export function generateStaticParams(){return sections.map(([section])=>({section}));}
export default async function SectionPage({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!sections.some(x=>x[0]===section))notFound();return <BusinessApp section={section}/>;}
