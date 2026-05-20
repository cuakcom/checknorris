/**
 * Shared types for the Check Norris Web Diagnostic suite.
 */

export type DiagnosticViewType = 'diagnostico' | 'correo' | 'dns' | 'seo' | 'ping' | 'nslookup';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'INF' | 'NET' | 'SEC' | 'SEO' | 'WRN' | 'ERR' | 'SUCCESS';
  message: string;
}

export interface DomainHistoryItem {
  id: string;
  domain: string;
  timestamp: string;
  score?: number;
  responseTime?: number;
  viewType: DiagnosticViewType;
}

export interface DiagnosticResult {
  domain: string;
  timestamp: string;
  responseTime: number;
  seoScore: number;
  sslValid: boolean;
  sslExpiry?: string;
  ipAddress: string;
  redirectsOk: boolean;
  dnsRecords: {
    A: string[];
    AAAA: string[];
    MX: string[];
    NS: string[];
    TXT: string[];
    CNAME: string[];
  };
  openPorts: number[];
  whois: {
    registrar: string;
    created: string;
    expires: string;
    owner: string;
    emails: string[];
  };
  seo: {
    h1Tags: string[];
    imagesWithoutAlt: number;
    metaTitle: string;
    metaDescription: string;
    indexed: boolean;
    pagespeedScore: number;
  };
}
