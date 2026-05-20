import { DiagnosticResult, LogEntry } from './types';

/**
 * Returns a list of mock but highly realistic DNS, SSL, SEO, and Mail records based on the domain name.
 */
export function generateDiagnosticResult(domain: string): DiagnosticResult {
  const cleanDomain = domain.toLowerCase().trim().replace(/^(https?:\/\/)?(www\.)?/, '');
  
  // Custom values for popular domains to make it feel super authentic
  let registrar = 'MarkMonitor Inc.';
  let owner = 'Contact Privacy Service';
  let created = '1997-09-15';
  let expires = '2028-09-14';
  let ipAddress = '142.250.180.14';
  let responseTime = Math.floor(Math.random() * 80) + 40; // fast for popular domains
  let seoScore = 95;
  let pagespeedScore = 92;
  let aRecords = [ipAddress];
  let mxRecords = ['10 smtp.google.com', '20 alt1.aspmx.l.google.com'];
  let nsRecords = ['ns1.google.com', 'ns2.google.com', 'ns3.google.com', 'ns4.google.com'];
  let txtRecords = ['v=spf1 include:_spf.google.com ~all', 'google-site-verification=XYZ123'];
  let cnameRecords = ['cname.google.com'];
  let openPorts = [80, 443];

  if (cleanDomain.includes('cuak.com') || !cleanDomain) {
    registrar = 'GoDaddy.com, LLC';
    owner = 'Domains By Proxy, LLC';
    created = '2016-04-12';
    expires = '2027-04-12';
    ipAddress = '104.21.31.102'; // actual Cloudflare IP
    responseTime = Math.floor(Math.random() * 120) + 180; // 180ms - 300ms
    seoScore = 88;
    pagespeedScore = 82;
    aRecords = ['104.21.31.102', '172.67.147.164'];
    mxRecords = ['10 mx.fallback.cuak.com', '20 mail.cuak.com'];
    nsRecords = ['ns1.cloudflare.com', 'ns2.cloudflare.com'];
    txtRecords = ['v=spf1 include:spf.protection.outlook.com -all', 'verification-hash=cf_987asf'];
    cnameRecords = ['cname.cuak.com'];
    openPorts = [80, 443, 8080];
  } else if (cleanDomain.includes('microsoft')) {
    registrar = 'MarkMonitor Inc.';
    owner = 'Microsoft Corporation';
    created = '1991-05-02';
    expires = '2026-05-03';
    ipAddress = '20.112.50.15';
    responseTime = Math.floor(Math.random() * 100) + 60;
    seoScore = 91;
    pagespeedScore = 85;
    aRecords = ['20.112.50.15'];
    mxRecords = ['10 microsoft-com.mail.protection.outlook.com'];
    nsRecords = ['ns1.msft.net', 'ns2.msft.net'];
    txtRecords = ['v=spf1 include:_spf-a.microsoft.com -all'];
    cnameRecords = ['cname.microsoft.com'];
    openPorts = [80, 443];
  } else if (cleanDomain.includes('github')) {
    registrar = 'MarkMonitor Inc.';
    owner = 'GitHub, Inc.';
    created = '2007-11-26';
    expires = '2026-11-26';
    ipAddress = '140.82.121.3';
    responseTime = Math.floor(Math.random() * 90) + 50;
    seoScore = 94;
    pagespeedScore = 89;
    aRecords = ['140.82.121.3', '140.82.121.4'];
    mxRecords = ['10 alt1.aspmx.l.google.com', '20 alt2.aspmx.l.google.com'];
    nsRecords = ['dns1.p01.nsone.net', 'dns2.p01.nsone.net'];
    txtRecords = ['v=spf1 include:_spf.github.com ~all'];
    cnameRecords = ['github.map.fastly.net'];
    openPorts = [22, 80, 443];
  } else {
    // Generate a beautiful generic diagnostic response
    const hash = cleanDomain.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const registrars = ['Namecheap, Inc.', 'GoDaddy.com, LLC', 'Hosting Concepts B.V. d/b/a Registrar.eu', 'Porkbun LLC', 'Tucows Domains Inc.'];
    registrar = registrars[hash % registrars.length];
    owner = 'Redacted for Privacy';
    
    const yearCreated = 2000 + (hash % 23);
    const month = String((hash % 12) + 1).padStart(2, '0');
    const day = String((hash % 28) + 1).padStart(2, '0');
    created = `${yearCreated}-${month}-${day}`;
    expires = `${yearCreated + 10}-${month}-${day}`;
    
    // IP Address mapping
    const b2 = (hash * 3) % 254 + 1;
    const b3 = (hash * 7) % 254 + 1;
    const b4 = (hash * 13) % 254 + 1;
    ipAddress = `185.${b2}.${b3}.${b4}`;
    
    responseTime = 120 + (hash % 250);
    seoScore = 65 + (hash % 34); // 65 - 98
    pagespeedScore = 55 + (hash % 43); // 55 - 97
    
    aRecords = [ipAddress];
    mxRecords = [`10 mail.${cleanDomain}`, `20 backup-mail.${cleanDomain}`];
    nsRecords = [`dns1.hosting-provider.net`, `dns2.hosting-provider.net`];
    txtRecords = [`v=spf1 a mx ip4:185.${b2}.${b3}.0/24 ~all`, `google-site-verification=gen-${hash}`];
    cnameRecords = [`www.${cleanDomain}`];
    openPorts = [80, 443, (hash % 2 === 0 ? 21 : 22), (hash % 5 === 0 ? 3306 : 8080)].filter((p, i, self) => self.indexOf(p) === i);
  }

  return {
    domain: cleanDomain || 'cuak.com',
    timestamp: new Date().toISOString(),
    responseTime,
    seoScore,
    sslValid: seoScore > 70, // generic logic
    sslExpiry: expires,
    ipAddress,
    redirectsOk: !(cleanDomain.length % 3 === 0),
    dnsRecords: {
      A: aRecords,
      AAAA: ['2606:4700:3030::ac43:93a4'],
      MX: mxRecords,
      NS: nsRecords,
      TXT: txtRecords,
      CNAME: cnameRecords
    },
    openPorts,
    whois: {
      registrar,
      created,
      expires,
      owner,
      emails: [`abuse@${registrar.toLowerCase().split(' ')[0]}.com`, `info@${cleanDomain || 'cuak.com'}`]
    },
    seo: {
      h1Tags: [`Bienvenidos a ${cleanDomain || 'cuak.com'}`],
      imagesWithoutAlt: Math.floor(Math.sqrt(responseTime / 10)),
      metaTitle: `${cleanDomain || 'Cuak.com'} | Soluciones Web Profesionales de Diagnóstico`,
      metaDescription: `Descubre las mejores utilidades y análisis técnico con la suite diagnosticadora para ${cleanDomain || 'cuak.com'}.`,
      indexed: seoScore > 75,
      pagespeedScore
    }
  };
}

/**
 * Procedural steps to stream logs during a crawl event based on the view type.
 */
export function getSimulatedLogSteps(domain: string, viewType: string): { type: string; message: string; delay: number }[] {
  const d = domain || 'cuak.com';
  
  switch (viewType) {
    case 'dns':
      return [
        { type: 'INF', message: `Initializing DNS lookup for ${d}...`, delay: 100 },
        { type: 'NET', message: `Querying root servers (13 active. IP resolved)...`, delay: 400 },
        { type: 'SUCCESS', message: `Resolved root authority servers [DONE]`, delay: 300 },
        { type: 'NET', message: `Querying Top-Level Domain (TLD) authority records...`, delay: 500 },
        { type: 'SUCCESS', message: `Resolving NS (Name Servers) records... [OK]`, delay: 300 },
        { type: 'INF', message: `Requesting direct authoritative zone parameters...`, delay: 400 },
        { type: 'PRIMARY', message: `Found 2 NS records listed at Cloudflare: ns1.cloudflare.com, ns2.cloudflare.com`, delay: 500 },
        { type: 'NET', message: `Testing A record edge propagation in 12 global nodes...`, delay: 600 },
        { type: 'SUCCESS', message: `A Record propagation checks: 98% complete (average Latency: 22ms)`, delay: 400 },
        { type: 'SEC', message: `MX check: mail.${d} (Priority 10) - Active & Reachable via TLSv1.3`, delay: 400 },
        { type: 'INF', message: `Waiting for ICMP ping echo response from edge IP...`, delay: 500 },
        { type: 'SUCCESS', message: `Received ECHO reply: packets transited successfully. Domain DNS state is stable.`, delay: 300 }
      ];
      
    case 'correo':
      return [
        { type: 'INF', message: `Iniciando Auditoría de Correo para ${d}...`, delay: 100 },
        { type: 'NET', message: `Consultando servidores de correo preferidos (registros MX)...`, delay: 500 },
        { type: 'SUCCESS', message: `Registros MX encontrados e indexados con éxito.`, delay: 300 },
        { type: 'SEC', message: `Verificando firma SPF (Sender Policy Framework)...`, delay: 400 },
        { type: 'SUCCESS', message: `Criterio SPF válido: SPF contiene inclusiones aprobadas.`, delay: 400 },
        { type: 'SEC', message: `Buscando registros DKIM de selector predeterminado o publicitario...`, delay: 500 },
        { type: 'INF', message: `Validando política DMARC (mecanismo de alineación de cabeceras)...`, delay: 400 },
        { type: 'SUCCESS', message: `DMARC configurado en modo 'quarantine' o 'none'. Protección activa.`, delay: 400 },
        { type: 'NET', message: `Consultando base de datos global AbuseIPDB sobre reputación de IPs asociadas...`, delay: 600 },
        { type: 'SEC', message: `Reputación de IP limpia. Ninguna queja por spam detectada en las últimas 72 horas.`, delay: 500 },
        { type: 'SUCCESS', message: `Auditoría de correo finalizada. Estado: ÓPTIMO`, delay: 200 }
      ];
      
    case 'seo':
      return [
        { type: 'INF', message: `Iniciando rastreador SEO (spider agent v4)...`, delay: 100 },
        { type: 'NET', message: `Resolución de DNS completada. Conectando con puerto HTTP/HTTPS...`, delay: 400 },
        { type: 'SUCCESS', message: `Handshake SSL establecido de forma segura. Descargando DOM raíz...`, delay: 300 },
        { type: 'INF', message: `Validando etiquetas meta cruciales y metadatos SEO...`, delay: 500 },
        { type: 'SUCCESS', message: `Etiqueta <title> encontrada y con tamaño correcto (68 caracteres)`, delay: 300 },
        { type: 'SUCCESS', message: `Meta Description optimizada para indexación comercial`, delay: 400 },
        { type: 'SEO', message: `Analizando estructura lógica de encabezados H1 y H2...`, delay: 500 },
        { type: 'WRN', message: `Atención: Se detectaron imágenes sin el atributo obligatorio 'alt' para accesibilidad`, delay: 600 },
        { type: 'SEO', message: `Comprobando sitemap.xml y robots.txt para rastreadores comerciales...`, delay: 450 },
        { type: 'SUCCESS', message: `Estado lógico: Indexación confirmada de forma óptima.`, delay: 300 }
      ];
      
    case 'diagnostico':
    default:
      return [
        { type: 'INF', message: `Iniciando diagnóstico general de la suite Check Norris para ${d}...`, delay: 100 },
        { type: 'NET', message: `Resolución de puerto y chequeos básicos de DNS...`, delay: 400 },
        { type: 'SEC', message: `Comprobando validez del enlace HTTPS y del certificado de seguridad SSL...`, delay: 500 },
        { type: 'SUCCESS', message: `Certificado SSL válido. Firmado por entidad certificadora de confianza.`, delay: 300 },
        { type: 'NET', message: `Midiendo saltos de Redirecciones lógicas y tiempo de carga por CDN...`, delay: 550 },
        { type: 'SUCCESS', message: `Redirección HTTPS canónica establecida perfectamente [DONE]`, delay: 300 },
        { type: 'INF', message: `Explorando puertos abiertos de servicio estándar (Web, SSH, Mail)...`, delay: 500 },
        { type: 'SUCCESS', message: `Escaneo de puertos completado con latencia mínima de 12ms.`, delay: 400 },
        { type: 'SUCCESS', message: `Comprobaciones integrales finalizadas con éxito. Datos cargados en Bento Grid.`, delay: 300 }
      ];
  }
}
