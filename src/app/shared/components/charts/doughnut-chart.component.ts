import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { BaseChartComponent } from './base-chart.component';

@Component({
  selector: 'app-doughnut-chart',
  standalone: true,
  imports: [BaseChartComponent],
  template: `
    <app-base-chart [config]="chartConfig"></app-base-chart>
  `,
})
export class DoughnutChartComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() data: number[] = [];
  @Input() colors: string[] = [];

  chartConfig: ChartConfiguration<'doughnut'> = this.buildConfig();

  ngOnChanges(_changes: SimpleChanges): void {
    this.chartConfig = this.buildConfig();
  }

  private buildConfig(): ChartConfiguration<'doughnut'> {
    return {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: this.colors,
            borderColor: '#fff',
            borderWidth: 2,
            hoverOffset: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '65%',
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: { usePointStyle: true, padding: 12, font: { size: 12 } },
          },
        },
      },
    };
  }
}
