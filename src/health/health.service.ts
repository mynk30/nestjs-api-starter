import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealth() {
    const uptimeSeconds = process.uptime();
    return {
      status: 'ok',
      uptime: uptimeSeconds,
      uptime_human: this.formatUptime(uptimeSeconds),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
    };
  }

  private formatUptime(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const parts: string[] = [];

    if (h > 0) parts.push(`${h}h`);
    if (m > 0) parts.push(`${m}m`);
    if (s > 0 || parts.length === 0) parts.push(`${s}s`);

    return parts.join(' ');
  }
}
