#!/usr/bin/env node
// Runs the real downloaded CLI against loopback fixtures only. No credentials or live API.
const{spawn}=require('node:child_process');const http=require('node:http');const fs=require('node:fs');const assert=require('node:assert/strict');const os=require('node:os');
const cli=process.argv[2];if(!cli)throw Error('Usage: node check.cjs /path/to/ploid-cli');
const home=fs.mkdtempSync(os.tmpdir()+'/ploid-contract-');let seen=[];
const server=http.createServer((req,res)=>{let body='';req.on('data',x=>body+=x);req.on('end',()=>{seen.push({method:req.method,path:req.url,body:body?JSON.parse(body):null});res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({data:{results:[],request_id:'synthetic_fixture'}}));});});
function run(args){return new Promise((resolve,reject)=>{const p=spawn(process.execPath,[cli,...args],{env:{PATH:process.env.PATH,HOME:home,XDG_CONFIG_HOME:home},stdio:['ignore','pipe','pipe']});let out='',err='';p.stdout.on('data',x=>out+=x);p.stderr.on('data',x=>err+=x);p.on('error',reject);p.on('close',code=>resolve({code,out,err}));});}
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port,prefix=['--json','--api-key','fixture-not-a-secret','--base-url',base];
for(const limit of ['0','151','1.5','oops']){seen=[];const r=await run([...prefix,'search','fixture','--limit',limit]);assert.notEqual(r.code,0);assert.equal(seen.length,0);}
let r=await run([...prefix,'search','fixture','--type','invalid']);assert.notEqual(r.code,0);assert.equal(seen.length,0);
seen=[];r=await run([...prefix,'search','synthetic founders','--title','founder','--company','Fixture Inc','--location','India','--limit','2','--type','instant']);assert.equal(r.code,0,r.err);assert.equal(seen.length,1);assert.equal(seen[0].path,'/v1/search');assert.equal(seen[0].method,'POST');assert.deepEqual(seen[0].body.filters,{title:'founder',company:'Fixture Inc',location:'India'});assert.equal(seen[0].body.num_results,2);assert.equal(seen[0].body.type,'instant');assert.equal(JSON.parse(r.out).request_id,'synthetic_fixture');
seen=[];r=await run(['--json','status']);assert.notEqual(r.code,0);assert.equal(seen.length,0);assert(r.err.includes('Not logged in'));
console.log('PASS 7 CLI contract checks: five invalid options cause zero requests; real CLI emits documented search schema against loopback; unauthenticated status fails before request.');
server.close();fs.rmSync(home,{recursive:true,force:true});})().catch(e=>{console.error(e);server.close();fs.rmSync(home,{recursive:true,force:true});process.exitCode=1});
