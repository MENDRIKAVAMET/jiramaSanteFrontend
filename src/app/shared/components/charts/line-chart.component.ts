import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartComponent } from './base-chart.component';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [BaseChartComponent],
  template: `
    <app-base-chart [config]="chartConfig"></app-base-chart>
  `,
})
export class LineChartComponent implements OnChanges {
  private base = new BaseChartComponent();

  @Input() labels: string[] = [];
  @Input() datasets: LineChartDataset[] = [];
  @Input() yAxisLabel = '';
  @Input() xAxisLabel = '';

  chartConfig: ChartConfiguration<'line'> = this.buildConfig();

  ngOnChanges(_changes: SimpleChanges): void {
    this.chartConfig = this.buildConfig();
  }

  private buildConfig(): ChartConfiguration<'line'> {
    return {
      type: 'line',
      data: {
        labels: this.labels,
        datasets: this.datasets.map((ds) => ({
          label: ds.label,
          data: ds.data,
          borderColor: ds.borderColor,
          backgroundColor: ds.backgroundColor ?? ds.borderColor + '20',
          fill: ds.fill ?? true,
          tension: ds.tension ?? 0.3,
          borderWidth: 2,
          pointRadius: 3,
          pointHoverRadius: 5,
        })),
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { usePointStyle: true, padding: 16, font: { size: 12 } },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { font: { size: 11 }, color: '#90a4ae' },
          },
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.05)' },
            ticks: { font: { size: 11 }, color: '#90a4ae' },
          },
        },
      },
    };
  }
}

export interface LineChartDataset {
  label: string;
  data: number[];
  borderColor: string;
  backgroundColor?: string;
  fill?: boolean;
  tension?: number;
}
