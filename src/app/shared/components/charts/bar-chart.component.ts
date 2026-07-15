import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartComponent } from './base-chart.component';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [BaseChartComponent],
  template: `<app-base-chart [config]="chartConfig"></app-base-chart>`,
})
export class BarChartComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() label = '';
  @Input() colors: string[] = ['#00897b'];

  chartConfig: ChartConfiguration<'bar'> = this.buildConfig();

  ngOnChanges(_changes: SimpleChanges): void {
    this.chartConfig = this.buildConfig();
  }

  private buildConfig(): ChartConfiguration<'bar'> {
    const bgColors = this.data.map((_, i) => this.colors[i % this.colors.length]);
    return {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [{ label: this.label, data: this.data, backgroundColor: bgColors, borderRadius: 6, borderSkipped: false, maxBarThickness: 40 }],
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, ticks: { font: { size: 11 }, color: '#90a4ae' } },
          y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { size: 11 }, color: '#90a4ae' } },
        },
      },
    };
  }
}
