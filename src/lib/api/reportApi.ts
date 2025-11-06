interface ApiResponse<T = null> {
  result: 'SUCCESS' | 'ERROR';
  data: T;
  error: {
    code: string;
    message: string;
  } | null;
}

export interface StrengthReportUpdateRequest {
  strength: string;
  experience: string;
  keyword: string[];
  appeal: string;
}

// 강점 리포트 삭제
export const deleteStrengthReport = async (
  strengthReportId: number
): Promise<void> => {
  try {
    const response = await fetch(`/api/report/strength/${strengthReportId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to delete strength report: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }
  } catch (error) {
    console.error('Error deleting strength report:', error);
    throw error;
  }
};

// 강점 리포트 수정
export const updateStrengthReport = async (
  strengthReportId: number,
  data: StrengthReportUpdateRequest
): Promise<void> => {
  try {
    const response = await fetch(`/api/report/strength/${strengthReportId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // HttpOnly 쿠키 포함
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(
        `Failed to update strength report: ${response.status} ${response.statusText}`
      );
    }

    const result: ApiResponse = await response.json();

    if (result.result !== 'SUCCESS') {
      throw new Error(result.error?.message || 'API request failed');
    }
  } catch (error) {
    console.error('Error updating strength report:', error);
    throw error;
  }
};
