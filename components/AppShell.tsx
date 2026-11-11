'use client';
import {useEffect,useState} from 'react';import {useRouter,usePathname} from 'next/navigation';import {sections} from '@/lib/ui-config';
export type Workspace={id:string;name:string};
export {api} from '@/lib/api-client';
import {api,errorMessage} from '@/lib/api-client';
export function useSession(){
 const [data,setData]=useState<{user:{name:string;email:string}|null;workspaces:Workspace[]}|null>(null);
 const [workspaceId,setWorkspaceId]=useState('');const [error,setError]=useState('');
 async function reload(){setError('');try{const d=await api('/api/bootstrap');setData(d);setWorkspaceId(v=>v||d.workspaces?.[0]?.id||'');}catch(e){setError(errorMessage(e));}}
 useEffect(()=>{void reload();},[]);return {data,workspaceId,setWorkspaceId,error,reload};
}
export default function AppShell({children,workspaceId,setWorkspaceId,data,locale,setLocale}:{children:React.ReactNode;workspaceId:string;setWorkspaceId:(x:string)=>void;data:{user:{name:string;email:string}|null;workspaces:Workspace[]};locale:string;setLocale:(x:string)=>void}){
 const path=usePathname(),router=useRouter();const rtl=locale==='fa';const [error,setError]=useState('');
 return <div className="shell" dir={rtl?'rtl':'ltr'}><aside className="sidebar"><div className="brand">Business<span>OS</span></div><select aria-label="Workspace" value={workspaceId} onChange={e=>setWorkspaceId(e.target.value)}>{data.workspaces.map(w=><option value={w.id} key={w.id}>{w.name}</option>)}</select><nav className="nav">{sections.map(([key,en,fa])=><a className={path===`/${key}`?'active':''} key={key} href={`/${key}`}>{rtl?fa:en}</a>)}</nav></aside><main className="main"><header className="top"><div><h1>{rtl?'سامانه مدیریت کسب‌وکار':'Business command center'}</h1><p>{data.user?.name} · {rtl?'مدیریت چند کسب‌وکار':'One place for all your workspaces'}</p></div><div className="top-actions"><button className="btn" onClick={()=>{setLocale(rtl?'en':'fa');try{localStorage.setItem('business-os-locale',rtl?'en':'fa');}catch{setError('Language changed for this visit. Your browser could not save the preference.');}}}>{rtl?'English':'فارسی'}</button><button className="btn" onClick={async()=>{setError('');try{await api('/api/auth/logout','POST');router.refresh();location.href='/';}catch(e){setError(errorMessage(e));}}}>Sign out</button></div></header>{error&&<p className="error" role="alert">{error}</p>}{children}</main></div>;
}
