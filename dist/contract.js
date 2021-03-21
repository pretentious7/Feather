var c=class{constructor(t,a){typeof t[a]=="undefined"&&(t[a]={balance:0,vaults:[]}),this.value=t[a],this.block_height=SmartWeave.block.height}burn(t){var a;this.value.stake=((a=this.value.stake)!=null?a:0)*t}get valid_vaults(){return this.value.vaults.filter(t=>t.end>=this.block_height&&t.start<=this.block_height)}get balance(){return this.value.vaults.filter(t=>t.end>=SmartWeave.block.height&&t.start<=SmartWeave.block.height).reduce((t,a)=>t-a.amount,this.value.balance)}consume(){return this.value}get _value(){return this.value}add_vault(t){if(this.balance<t.amount)throw new ContractError("not enough balance");if(this.block_height<t.start||this.block_height>=t.end)throw new ContractError("invalid block height");this.value.vaults.push(t)}remove_vault(t){let a=this.valid_vaults.map(r=>r.amount);if(a.includes(t))this.value.balance-=t,this.value.vaults=this.valid_vaults.filter((r,i)=>i!==a.indexOf(t));else throw new ContractError(`no vault of quantity ${t}`)}increase_balance(t,a){t.remove_vault(a),this.value.balance+=a}};var V;(function(e){e.proposed="proposed",e.executable="executable"})(V||(V={}));var h;(function(e){e.webgpu="webgpu",e.wasm="wasm"})(h||(h={}));var E;(function(e){e.propose="propose",e.bid="bid",e.accept="accept",e.result="result",e.validate="validate",e.validate_lock="validate_lock",e.validate_release="validate_release"})(E||(E={}));var T;(function(e){e.lock="lock",e.unlock="unlock"})(T||(T={}));var d=e=>/[\w-]{43}/i.test(e),S={get(e,t){switch(t){case"executable_address":if(d(e.executable_address))return e.executable_address;throw new ContractError(`
						${String(e.executable_address)}
						is not valid Arweave Address
						`);case"executable_kind":if(e.executable_kind in h)return e.executable_kind;throw new ContractError(`
					${e.executable_kind}
					is not valid executable type
					`);default:throw new ContractError(`
					${String(t)} is invalid key
					`)}}},g=e=>typeof e=="number"&&e>0,R={get(e,t){switch(t){case"executable_key":if(d(e.executable_key))return e.executable_key;throw new ContractError(`
					${String(e.executable_key)}
					is not valid executable key
					`);case"quantity":if(g(e.quantity))return e.quantity;throw new ContractError(`
					${String(e.quantity)} 
					is not valid bid quantity
					`);default:throw new ContractError(`
						${String(t)} is invalid key
						`)}}},L={get(e,t){switch(t){case"accepted_bid":return ContractAssert(g(e.accepted_bid.quantity),"invalid amount"),ContractAssert(d(e.accepted_bid.bidder),"bad accepted bid bidder"),e.accepted_bid;case"executable_key":return ContractAssert(d(e.executable_key),"not valid executable key"),e.executable_key;default:throw new ContractError("invalid key")}}},P={get(e,t){switch(t){case"result_address":if(d(e.result_address))return e.result_address;throw new ContractError(`${String(e.result_address)}
						is not Arweave Address`);case"executable_key":if(d(e.executable_key))return e.executable_key;throw new ContractError(`
					${String(e.executable_key)}
					is not valid executable key
					`);default:throw new ContractError(`
					${String(t)} is invalid key
					`)}}},C={get(e,t){switch(t){case"encrypted_hash":return e.encrypted_hash;case"executable_key":return ContractAssert(d(e.executable_key),"invalid executable key (not arweave address)"),e.executable_key;default:throw new ContractError("invalid key")}}},B={get(e,t){switch(t){case"executable_key":return ContractAssert(d(e.executable_key),"invalid executable key (not arweave address)"),e.executable_key;case"symm_key":return e.symm_key;default:throw new ContractError("invalid key")}}};async function _(e){return SmartWeave.arweave.crypto.decrypt(Buffer.from(e[1],"hex"),e[0]).then(t=>t.toString())}function A(e){return e.length-1}function k(e){let t=[];do{let a=e;t.push(a)}while(e.next);return t}function w(e){return e.length>0?{value:e.shift(),next:w(e)}:void 0}function I(e,t){return e==null?void 0:e.every(a=>a._discriminator===t)}function s(e,t){return e._discriminator===t}function q(e,t){let a=new Set(e);for(let r of t)a.delete(r);return a}function O(e){let t=U(e);return function(a){let r=a.reduce((n,l)=>n+l[1],0),i=a.map(n=>n[1]/r),o=t();for(let n=0,l=i[0];n<i.length;n++,l+=i[n])if(o<l)return a[n][0];throw new Error("Impossible state, probability function borked")}}function U(e){return function(){e=Math.trunc(e),e=Math.trunc(e+1831565813);let t=Math.imul(e^e>>>15,1|e);return t^=t+Math.imul(t^t>>>7,61|t),((t^t>>>14)>>>0)/4294967296}}var f=class{constructor(t){this.value=t}next(t){return t(this.value)}},m=class extends f{constructor(t){if(!s(t,"announce"))throw new ContractError("validation not in announce state!");super(t)}},p=class extends f{constructor(t){if(!s(t,"lock"))throw new ContractError("validation not in locked state!");super(t)}},u=class extends f{constructor(t){if(!s(t,"release"))throw new ContractError("validation not in released state!");super(t)}};function W(e){return t=>new p({...t,_discriminator:"lock",encrypted_hash:e.encrypted_hash})}function $(e){let t=e.symm_key;return a=>new u({...a,_discriminator:"release",symm_key:t})}var x=class{constructor(t){this.value=t}next(t){return t(this.value)}consume(){return this.value}},b=class extends x{constructor(t){if(!s(t,"proposed"))throw new ContractError("executable not in proposed state!");super(t)}},J=()=>({start:SmartWeave.block.height,end:SmartWeave.block.height+1e3}),y=class extends x{constructor(t){if(!s(t,"accepted"))throw new ContractError("executable not in accepted state!");super(t)}get accepted_bid(){return this.value.accepted_bid}get caller(){return this.value.caller}post_collateral(t){t.add_vault({amount:.1*this.accepted_bid.quantity,...J()})}};function z(e){switch(e._discriminator){case"announce":return new m(e);case"lock":return new p(e);case"release":return new u(e);default:throw new ContractError("impossible!")}}var v=class extends x{constructor(t){if(!s(t,"result"))throw new ContractError("executable not in result state!");super(t);this.validations=k(this.value.validation_linked_list).map(a=>a.value.map(z))}get validation_tail(){return this.validations[A(this.validations)]}get used_validators(){return this.validations.flatMap(t=>t.map(a=>a.value.validator))}lock_validation(t,a){this.validation_tail[t]=new p(this.validation_tail[t].next(W(a)).value)}release_validation(t,a){this.validation_tail[t]=new u(this.validation_tail[t].next($(a)).value)}allowed_validators(t){let a=new Set(this.used_validators),r=new Set(Object.keys(t)),i=q(r,a);return new Set(Array.from(i).map(o=>[o,t._]))}consume(){return this.value.validation_linked_list=w(this.validations.map(t=>t.map(a=>a.value))),this.value}check_fully_released(){return I(this.validation_tail.map(t=>t.value),"release")}async branch(t,a){let r=this.validation_tail.map(o=>o.value);if(!I(r,"release"))throw new ContractError("cannot branch if validations not released");let i=r.map(async o=>_([o.symm_key,o.encrypted_hash]));return Promise.all(i).then(o=>{let n=JSON.parse(o[0]).is_correct;return o.every(l=>l===o[0])?this.next(()=>new M({...this.consume(),_discriminator:"validated",is_correct:n},a)):(this.validations.push(H(new c(a,"regulator"),.05*this.value.accepted_bid.quantity,this.allowed_validators(t)).map(l=>new m(l))),this)}).catch(o=>{throw new ContractError(`${String(o)}`)})}},M=class extends x{get validation_tail(){return this.validations[A(this.validations)]}constructor(t,a){if(!s(t,"validated"))throw new ContractError("executable not in validated state!");super(t);let r=new c(a,"regulator"),i=new c(a,this.value.result.giver);this.validations=k(this.value.validation_linked_list).map(o=>o.value.map(n=>new u(n))),this.validations.flat().forEach(async o=>{let n=new c(a,o.value.validator);await _([o.value.symm_key,o.value.encrypted_hash])===await _([this.validation_tail[0].value.symm_key,this.validation_tail[0].value.encrypted_hash])?n.increase_balance(r,.05*this.value.accepted_bid.quantity):n.burn(.5)}),this.value.is_correct&&i.increase_balance(new c(a,this.value.caller),this.value.accepted_bid.quantity),r.increase_balance(i,.1*this.value.accepted_bid.quantity)}};function N(e){return t=>new y({...t,_discriminator:"accepted",accepted_bid:e.accepted_bid})}function H(e,t,a){a.forEach(()=>e.add_vault({amount:t,end:Number(SmartWeave.block.height)+1e3,start:Number(SmartWeave.block.height)}));let r=O(Number(SmartWeave.block.indep_hash)),i=r(Array.from(a).map(n=>[n,n[1].stake]));a.delete(i);let o=r(Array.from(a).map(n=>[n,n[1].stake]));return[{_discriminator:"announce",validator:i[0]},{_discriminator:"announce",validator:o[0]}]}function D(e,t,a,r){return i=>new v({...i,_discriminator:"result",validation_linked_list:{value:H(new c(r,"regulator"),.05*i.accepted_bid.quantity,a),next:void 0},result:{address:e.result_address,giver:t,height:SmartWeave.block.height}})}function j(e){return Object.fromEntries(Object.entries(e.accounts).filter(t=>typeof t[1].stake!="undefined"))}async function Q(e,t){switch(t.input.function){case"propose":{let a=new Proxy(t.input,S),r=new b({_discriminator:"proposed",bids:[],caller:t.caller,executable:{birth_height:SmartWeave.block.height,executable_address:a.executable_address,executable_kind:a.executable_kind}});return e.executables[SmartWeave.transaction.id]=r.value,{state:e}}case"bid":{let a=new Proxy(t.input,R),r=new b(e.executables[a.executable_key]);return r.value.bids.push({bidder:t.caller,quantity:a.quantity}),e.executables[a.executable_key]=r.value,{state:e}}case"accept":{let a=new Proxy(t.input,L),r=e.executables[a.executable_key];ContractAssert(r.caller===t.caller,`${t.caller} is not creator of proposal`);let o=new b(r).next(N(a)),n=new c(e.accounts,r.caller);return n.add_vault({amount:a.accepted_bid.quantity,start:SmartWeave.block.height,end:SmartWeave.block.height+1e3}),e.executables[a.executable_key]=o.value,e.accounts[r.caller]=n.value,{state:e}}case"result":{let a=new Proxy(t.input,P),r=e.executables[a.executable_key],i=new y(r);ContractAssert(i.accepted_bid.bidder===t.caller,"result not made by winning bidder!");let o=j(e),n=new c(e.accounts,t.caller);i.post_collateral(n);let l=i.next(D(a,t.caller,new Set(Object.entries(o)),e.accounts));return e.executables[a.executable_key]=l.consume(),{state:e}}case"validate_lock":{let a=new Proxy(t.input,C),r=e.executables[a.executable_key],i=new v(r),o=i.validation_tail.findIndex(n=>n.value.validator===t.caller&&n.value._discriminator==="announce");return ContractAssert(o!==-1,"no matching validation!"),i.lock_validation(o,a),e.executables[a.executable_key]=i.consume(),{state:e}}case"validate_release":{let a=new Proxy(t.input,B),r=e.executables[a.executable_key],i=new v(r);if(!i.validation_tail.every(n=>n.value._discriminator!=="announce"))throw new ContractError("entire vll is not locked");let o=i.validation_tail.findIndex(n=>n.value.validator===t.caller&&n.value._discriminator==="lock");ContractAssert(o!==-1,"no matching validation!"),i.release_validation(o,a);try{let n=i.check_fully_released()?await i.branch(j(e),e.accounts):i;return e.executables[a.executable_key]=n.consume(),{state:e}}catch(n){throw n}}case"proposed":return{result:Object.entries(e.executables).filter(a=>s(a[1],"proposed"))};default:throw new ContractError("Invalid function call")}}export{Q as handle};
