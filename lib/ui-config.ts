export const sections=[
 ['dashboard','Dashboard','داشبورد'],['businesses','Businesses','کسب‌وکارها'],['accounts','Accounts','حساب‌ها'],['journal','Accounting','حسابداری'],['counterparties','CRM Contacts','مخاطبان'],['opportunities','Sales Pipeline','فرصت‌های فروش'],['projects','Projects','پروژه‌ها'],['tasks','Tasks','وظایف'],['products','Products','محصولات'],['warehouses','Warehouses','انبارها'],['inventory','Stock Movements','گردش کالا'],['orders','Orders','سفارش‌ها'],['shipments','Shipments','محموله‌ها'],['imports','Imports','واردسازی'],['approvals','Approvals','تأییدیه‌ها'],['agents','Agents','عامل‌ها'],['reports','Reports','گزارش‌ها'],['search','Search','جستجو'],['settings','Settings','تنظیمات']
] as const;
export const configs:Record<string,{fields:{name:string;label:string;type?:string;options?:string[]}[];columns:string[]}>= {
 businesses:{fields:[{name:'name',label:'Business name'},{name:'kind',label:'Kind',options:['BUSINESS','PERSONAL','INVESTMENT']}],columns:['name','kind']},
 counterparties:{fields:[{name:'name',label:'Name'},{name:'type',label:'Type',options:['ORGANIZATION','PERSON']},{name:'email',label:'Email'},{name:'phone',label:'Phone'},{name:'notes',label:'Notes'}],columns:['name','type','email','phone']},
 accounts:{fields:[{name:'code',label:'Account code'},{name:'name',label:'Name'},{name:'type',label:'Type',options:['ASSET','LIABILITY','EQUITY','REVENUE','EXPENSE']},{name:'currencyCode',label:'Currency',options:['IRR','USD','EUR','RUB']},{name:'businessId',label:'Business ID (optional)'}],columns:['code','name','type','currencyCode','businessId']},
 opportunities:{fields:[{name:'title',label:'Title'},{name:'counterpartyId',label:'Contact ID'},{name:'ownerName',label:'Owner'},{name:'nextAction',label:'Next action'},{name:'stage',label:'Stage',options:['IDENTIFIED','QUALIFIED','CONTACTED','NEEDS_ASSESSMENT','QUOTATION','NEGOTIATION','WON','LOST']},{name:'value',label:'Estimated amount'},{name:'currencyCode',label:'Currency'}],columns:['title','stage','value','currencyCode','nextAction']},
 projects:{fields:[{name:'title',label:'Project title'},{name:'businessId',label:'Business ID (optional)'},{name:'description',label:'Description'}],columns:['title','description']},
 tasks:{fields:[{name:'title',label:'Task title'},{name:'status',label:'Status',options:['TODO','IN_PROGRESS','BLOCKED','DONE']},{name:'priority',label:'Priority (1-4)',type:'number'},{name:'projectId',label:'Project ID (optional)'},{name:'dueAt',label:'Due (optional)',type:'datetime-local'}],columns:['title','status','priority','dueAt']},
 products:{fields:[{name:'sku',label:'SKU'},{name:'name',label:'Product name'},{name:'unit',label:'Unit'}],columns:['sku','name','unit']},
 warehouses:{fields:[{name:'name',label:'Warehouse name'}],columns:['name']},
 orders:{fields:[{name:'counterpartyId',label:'Contact ID'},{name:'direction',label:'Direction',options:['PURCHASE','SALE']},{name:'status',label:'Status',options:['DRAFT','CONFIRMED','CANCELLED']},{name:'total',label:'Total'},{name:'currencyCode',label:'Currency',options:['IRR','USD','EUR','RUB']}],columns:['direction','status','total','currencyCode']},
 shipments:{fields:[{name:'reference',label:'Reference'},{name:'status',label:'Status',options:['PLANNED','IN_TRANSIT','DELIVERED','CANCELLED']},{name:'currencyCode',label:'Currency',options:['IRR','USD','EUR','RUB']},{name:'freight',label:'Freight'},{name:'customs',label:'Customs'},{name:'handling',label:'Handling'}],columns:['reference','status','freight','customs','handling']},
 agents:{fields:[{name:'name',label:'Agent name'},{name:'description',label:'Description'},{name:'status',label:'Status',options:['DISABLED','PAUSED','ENABLED']}],columns:['name','description','status']}
};

export type FormField = {name:string;label:string;type?:string;options?:string[]};
const requiredFields:Record<string,string[]> = {
 businesses:['name'],counterparties:['name'],accounts:['code','name','type','currencyCode'],
 opportunities:['title','counterpartyId','ownerName','nextAction'],projects:['title'],tasks:['title'],
 products:['sku','name'],warehouses:['name'],orders:['counterpartyId','direction','total','currencyCode'],
 shipments:['reference','currencyCode'],agents:['name'],inventory:['productId','warehouseId','quantity','reason'],
 journal:['description','currencyCode','amount','debitAccountId','creditAccountId'],imports:['filename','content'],approvals:['action','description'],
};
const tips:Record<string,string> = {
 name:'Use a clear, recognizable name (up to 250 characters).',title:'Describe the work in a short title (up to 250 characters).',
 businessId:'Copy the full Record ID from Businesses in this workspace.',projectId:'Copy the full Record ID from Projects in this workspace.',
 counterpartyId:'Create a CRM contact first, then copy its full Record ID from CRM Contacts.',
 productId:'Create a product first, then copy its full Record ID from Products.',warehouseId:'Create a warehouse first, then copy its full Record ID from Warehouses.',
 debitAccountId:'Copy the full Record ID from Accounts. Its currency must match this entry.',creditAccountId:'Copy the full Record ID from Accounts. Its currency must match this entry.',
 code:'Choose a unique account code within this workspace, for example 1001 (up to 30 characters).',
 sku:'Use a unique product code within this workspace, for example PART-001 (up to 80 characters).',
 email:'Enter a complete email address, for example name@example.com.',phone:'Include the country code, for example +98 21 12345678.',
 unit:'Enter the unit used for stock quantities, for example pcs or kg. Defaults to pcs.',
 priority:'Enter a whole number from 1 to 4; 1 is highest priority. Defaults to 2.',
 dueAt:'Choose a date and time in your local timezone. Leave blank if there is no deadline.',
 nextAction:'Describe the next concrete step, for example Call to confirm delivery date.',ownerName:'Enter the name of the person responsible for this opportunity.',
 quantity:'Use a positive number for stock received or a negative number for stock removed, for example 10 or -2.5. Up to 4 decimal places; zero is not allowed.',
 reason:'Explain why stock changed, for example Customer delivery (3–500 characters).',
 amount:'Enter an amount greater than zero, for example 1250.50. Use a decimal point, no commas or currency symbols, and at most 4 decimal places.',
 value:'Enter a nonnegative amount, for example 1250.50, with up to 4 decimal places. Do not include commas or currency symbols.',
 total:'Enter a nonnegative total, for example 1250.50, with up to 4 decimal places. Do not include commas or currency symbols.',
 freight:'Enter a nonnegative freight cost with up to 4 decimal places; defaults to 0.',customs:'Enter a nonnegative customs cost with up to 4 decimal places; defaults to 0.',handling:'Enter a nonnegative handling cost with up to 4 decimal places; defaults to 0.',
 currencyCode:'Choose the currency used for this record. IRR is Iranian rial.',
 reference:'Enter a shipment reference you can recognize later, for example SHIP-2026-001.',
 filename:'Enter a filename ending in .csv, for example contacts.csv.',
 content:'Paste a header row followed by data rows, for example name,email then Ali,ali@example.com on the next line. Use plain commas, no quoted values, and at most 500 data rows.',
 action:'Name the action you want reviewed, for example Approve supplier payment (2–100 characters).',
 description:'Add enough detail for someone else to understand this record.',notes:'Add useful background or follow-up details (up to 5000 characters).',
};
export function fieldGuide(section:string,field:FormField){
 const required=requiredFields[section]?.includes(field.name)??false;
 let tip=tips[field.name]||(field.options?'Choose the option that best describes this record.':'Enter a short, descriptive value.');
 if(section==='agents'&&field.name==='status')tip='Defaults to DISABLED. Agent records store configuration; they do not execute actions.';
 if(section==='tasks'&&field.name==='status')tip='Defaults to TODO. Update the status as work progresses.';
 if(section==='opportunities'&&field.name==='currencyCode')tip='Enter IRR, USD, EUR, or RUB to identify the estimated amount’s currency.';
 return {required,tip:`${required?'Required.':'Optional; you may leave this blank.'} ${tip}`};
}
