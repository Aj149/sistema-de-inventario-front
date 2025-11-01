import { AfterViewInit, Component } from '@angular/core';
import  ApexCharts from 'apexcharts';
import type { ApexOptions } from 'apexcharts';
import { Footer } from "../../shared/footer/footer";
import { NavbarComponent } from "../../shared/navbar/navbar";

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, Footer],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit {

  
  // ✅ Método que retorna las opciones del gráfico
  private getChartOptions(): ApexOptions {
    return {
      series: [35.1, 23.5, 2.4, 5.4],
      colors: ["#1C64F2", "#16BDCA", "#FDBA8C", "#E74694"],
      chart: {
        height: 200,
        width: "100%",
        type: "donut",
      },
      stroke: {
        colors: ["transparent"],
        lineCap: "butt",
      },
      plotOptions: {
        pie: {
          donut: {
            labels: {
              show: true,
              name: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: 20,
              },
              total: {
                showAlways: true,
                show: true,
                label: "Total product",
                fontFamily: "Inter, sans-serif",
                formatter: (w: { globals: { seriesTotals: number[] } }) => {
                  const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                  return '$' + sum + 'k';
                },
              },
              value: {
                show: true,
                fontFamily: "Inter, sans-serif",
                offsetY: -20,
                formatter: (value: string) => `${parseFloat(value)}k`,
              },
            },
            size: "80%",
          },
        },
      },
      grid: {
        padding: { top: -2 },
      },
      labels: ["Direct", "Sponsor", "Affiliate", "Email marketing"],
      dataLabels: { enabled: false },
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
      },
      yaxis: {
        labels: {
          formatter: (value: number) => value + "k",
        },
      },
      xaxis: {
        labels: {
          formatter: (value: string) => `${parseFloat(value)}k`,
        },
        axisTicks: { show: false },
        axisBorder: { show: false },
      },
    };
  }
  
  // ✅ Manejar el cambio en los checkboxes
  private handleCheckboxChange(event: Event, chart: ApexCharts) {
    const checkbox = event.target as HTMLInputElement;
  
    if (checkbox.checked) {
      switch (checkbox.value) {
        case 'desktop':
          chart.updateSeries([15.1, 22.5, 4.4, 8.4]);
          break;
        case 'tablet':
          chart.updateSeries([25.1, 26.5, 1.4, 3.4]);
          break;
        case 'mobile':
          chart.updateSeries([45.1, 27.5, 8.4, 2.4]);
          break;
        default:
          chart.updateSeries([55.1, 28.5, 1.4, 5.4]);
      }
    } else {
      chart.updateSeries([35.1, 23.5, 2.4, 5.4]);
    }
  }
  
  // ✅ Inicializar el gráfico una vez que el DOM esté cargado
 
  
  
  // grafica de barras
  
  
  
  
  
  // Opciones tipadas como ApexOptions
  private options: ApexOptions = {
    series: [
      {
        name: "Income",
        color: "#31C48D",
        data: [1420, 1620, 1820, 1420, 1650, 2120] // números en lugar de strings
      },
      {
        name: "Expense",
        color: "#F05252",
        data: [788, 810, 866, 788, 1100, 1200] // números en lugar de strings
      }
    ],
    chart: {
      type: "bar",
      width: "100%",
      height: 200,
      sparkline: { enabled: false },
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: "100%",
        borderRadiusApplication: "end",
        borderRadius: 6,
        dataLabels: { position: "top" },
      },
    },
    legend: {
      show: true,
      position: "bottom",
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value: number) => "$" + value
      }
    },
    xaxis: {
      categories: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        },
        formatter: (value: number | string) => "$" + value
      },
      axisTicks: { show: false },
      axisBorder: { show: false },
    },
    yaxis: {
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
        }
      }
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: { left: 2, right: 2, top: -20 },
    },
    fill: { opacity: 1 },
  };
  
  ngAfterViewInit(): void {
  // --- Donut chart ---
  const donutChartElement = document.getElementById("donut-chart");
  if (donutChartElement && typeof ApexCharts !== "undefined") {
    const donutChart = new ApexCharts(donutChartElement, this.getChartOptions());
    donutChart.render();

    const checkboxes: NodeListOf<HTMLInputElement> =
      document.querySelectorAll('#devices input[type="checkbox"]');

    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', (event) =>
        this.handleCheckboxChange(event, donutChart)
      );
    });
  }

  // --- Bar chart ---
  const barChartElement = document.getElementById("bar-chart");
  if (barChartElement && typeof ApexCharts !== "undefined") {
    const barChart = new ApexCharts(barChartElement, this.options);
    barChart.render();
  }
}

}
