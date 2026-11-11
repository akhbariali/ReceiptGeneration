'use client';
import {useEffect} from 'react';
export default function ErrorPage({error,reset}:{error:Error & {digest?:string};reset:()=>void}){
 useEffect(()=>{console.error('Page failed:',error);},[error]);
 return <main className="login"><div className="card stack"><h1>This page could not be loaded</h1><p role="alert">Something went wrong. Try loading the page again. If you were saving a record, check the record list before submitting it again.</p><button className="btn primary" onClick={reset}>Try again</button><a href="/dashboard">Go to dashboard</a></div></main>;
}
