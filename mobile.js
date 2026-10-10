/* Installation and caching only. Crochet data remains in the app's local store. */
(() => {
 const el=id=>document.getElementById(id),standalone=()=>navigator.standalone===true||matchMedia('(display-mode: standalone)').matches;
 let registration=null,reloadApproved=false;
 const setStatus=text=>{el('phone-offline').textContent=text;};
 function installation(){el('phone-installed').textContent=standalone()?'Opened from Home Screen':'In Safari, choose Share → Add to Home Screen → Open as Web App → Add. Then open the new icon while online.';}
 async function checkOffline(){
  const worker=navigator.serviceWorker?.controller;
  if(!worker){setStatus('Preparing offline copy… Keep this app open online.');return;}
  try{const result=await new Promise((resolve,reject)=>{const channel=new MessageChannel(),timer=setTimeout(()=>reject(Error('Offline verification timed out.')),7000);channel.port1.onmessage=e=>{clearTimeout(timer);channel.port1.close();resolve(e.data);};worker.postMessage({type:'CHECK_OFFLINE'},[channel.port2]);});
   setStatus(result?.ready?'Offline ready · '+(navigator.onLine?'download verified':'working without a connection'):'Offline copy incomplete · reconnect and tap Check for updates');
   el('phone-cache-detail').textContent=result?.ready?'All app files are saved on this device. Before traveling, switch to airplane mode, close the app and open it again. Keep JSON backups of your projects.':'Some app files have not been cached. Do not rely on offline access yet.';
  }catch(e){setStatus('Could not verify offline copy');el('phone-cache-detail').textContent=e.message+' Reconnect and try again.';}
 }
 function updateNotice(){const waiting=registration?.waiting;el('phone-apply-update').hidden=!waiting;el('phone-update-note').textContent=waiting?'A new app version is downloaded. Save a backup before updating if you are midway through a project. Your local project store is retained.':'';}
 async function register(){installation();if(location.protocol==='file:'){setStatus('Upload this folder to HTTPS hosting to install on iPhone');el('phone-cache-detail').textContent='Opening index.html from Files is not an offline installation. Follow the included setup guide.';return;}
  if(!isSecureContext||!('serviceWorker'in navigator)){setStatus('Offline installation unavailable');el('phone-cache-detail').textContent='Open the HTTPS address in an up-to-date Safari. This browser cannot install the offline copy.';return;}
  try{registration=await navigator.serviceWorker.register('./sw.js',{scope:'./',updateViaCache:'none'});registration.addEventListener('updatefound',()=>{const worker=registration.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){updateNotice();checkOffline();}if(worker.state==='redundant'){el('phone-update-note').textContent='The new download did not finish. Your existing offline copy is retained; try again online.';}});});updateNotice();await navigator.serviceWorker.ready;await checkOffline();}catch(e){setStatus('Offline setup did not finish');el('phone-cache-detail').textContent='Keep an internet connection and retry. '+e.message;}
 }
 el('phone-check').onclick=async()=>{try{if(!navigator.onLine){await checkOffline();return;}if(!registration){await register();return;}el('phone-update-note').textContent='Checking for updates…';await registration.update();updateNotice();await checkOffline();}catch(e){el('phone-update-note').textContent='Could not check for updates. Your saved offline copy is unchanged. '+e.message;}};
 el('phone-apply-update').onclick=()=>{if(!registration?.waiting)return;try{if(typeof ready!=='undefined'&&ready&&!readOnly){saveBuilder();if(current)persist();if(!storageHealthy){el('phone-update-note').textContent='Storage could not save your changes. Export a JSON backup before updating.';return;}}reloadApproved=true;registration.waiting.postMessage({type:'ACTIVATE_UPDATE'});}catch(e){el('phone-update-note').textContent='Update paused: '+e.message;}};
 el('phone-protect').onclick=async()=>{try{const granted=await navigator.storage?.persist?.();el('phone-storage-detail').textContent=granted?'Persistent storage granted. Keep backups in Files as well.':'This browser did not grant persistent storage. Home Screen installation and regular JSON backups are still recommended.';}catch{el('phone-storage-detail').textContent='Storage protection is unavailable here. Keep regular JSON backups.';}};
 navigator.serviceWorker?.addEventListener('controllerchange',()=>{if(reloadApproved){location.reload();return;}checkOffline();updateNotice();});
 window.addEventListener('online',checkOffline);window.addEventListener('offline',checkOffline);document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){installation();checkOffline();updateNotice();}});
 // The desktop footer's single-file download does not install a PWA.
 const download=document.querySelector('footer a[download]');if(download){download.removeAttribute('download');download.href='./setup.html';download.textContent='iPhone setup & backup guide';}
 register();
})();
