import { Component, Input, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { Chart, registerables, ChartConfiguration, ChartType } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-base-chart',
  standalone: true,
  template: `<div class="chart-wrapper"><canvas #canvas></canvas></div>`,
  styles: [`
    .chart-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      min-height: 200px;
    }
    canvas {
      max-width: 100%;
    }
  `],
})
export class BaseChartComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private chart: Chart | null = null;
  private _config: ChartConfiguration | null = null;

  @Input() set config(value: ChartConfiguration | null) {
    this._config = value;
    if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
    if (value) {
      this.renderChart(value);
    }
  }

  ngAfterViewInit(): void {
    if (this._config) {
      this.renderChart(this._config);
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  private renderChart(config: ChartConfiguration): void {
    if (!this.canvasRef?.nativeElement) return;
    if (this.chart) {
      this.chart.destroy();
    }
    this.chart = new Chart(this.canvasRef.nativeElement, config);
  }
}
