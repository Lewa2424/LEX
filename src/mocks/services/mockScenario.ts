/**
 * @fileoverview Конфигурация сценариев имитации работы бэкенда (Mock Scenarios).
 * Поддерживает сценарии: 'normal' | 'slow' | 'empty' | 'error'.
 * Можно активировать через параметр URL ?mockScenario=slow или программно.
 */

export type MockScenarioType = 'normal' | 'slow' | 'empty' | 'error';

class MockScenarioManager {
  private scenario: MockScenarioType = 'normal';

  constructor() {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const urlParam = params.get('mockScenario') as MockScenarioType | null;
      if (urlParam && ['normal', 'slow', 'empty', 'error'].includes(urlParam)) {
        this.scenario = urlParam;
      }
    }
  }

  /** Устанавливает текущий сценарий mock-бэкенда */
  public setScenario(scenario: MockScenarioType): void {
    this.scenario = scenario;
  }

  /** Возвращает текущий активный сценарий */
  public getScenario(): MockScenarioType {
    return this.scenario;
  }

  /**
   * Применяет временную задержку и проверку на генерацию ошибок или пустых ответов.
   */
  public async simulateRequest<T>(normalData: T, emptyData: T): Promise<T> {
    const delay = this.scenario === 'slow' ? 1500 : 150;
    await new Promise((resolve) => setTimeout(resolve, delay));

    if (this.scenario === 'error') {
      throw new Error('[Mock Scenario] Імітація збою мережі або помилки бекенда');
    }

    if (this.scenario === 'empty') {
      return emptyData;
    }

    return normalData;
  }
}

export const mockScenarioManager = new MockScenarioManager();
