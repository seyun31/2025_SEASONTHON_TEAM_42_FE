'use client';

import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { mockRoadmapData, defaultCareerInfo } from '@/data/roadmapData';
import {
  ChecklistItem,
  RoadmapChecklist,
  RoadMapResponse,
  RoadmapInputResponse,
  RoadMapUpdateRequest,
} from '@/types/roadmap';
import { PiStarThin } from 'react-icons/pi';
import { HiStar } from 'react-icons/hi';
import { IoMdMore } from 'react-icons/io';
import {
  toggleRoadMapAction,
  updateRoadmapAction,
  deleteRoadmapAction,
  addRoadmapAction,
  deleteRoadmap,
  updateRoadmapInput,
  updateRoadmapCategory,
} from '@/lib/api/jobApi';
import RoadmapPosition from '@/components/ui/RoadmapPosition';
import RoadmapBackground from '@/components/ui/RoadmapBackground';
import CompletionAnimation from '@/components/ui/CompletionAnimation';
import RoadmapHeader from '@/components/ui/RoadmapHeader';
import DeleteConfirmModal from '@/components/ui/DeleteConfirmModal';
import {
  convertApiDataToRoadmapSteps,
  USER_MAP_POSITIONS,
} from '@/lib/utils/roadmapUtils';

interface UserCheckListProps {
  userName: string;
  hasRoadmap?: boolean;
  roadmapData?: RoadMapResponse | null;
  onRoadmapUpdate?: () => void;
  isLoading?: boolean;
}

export default function UserCheckList({
  userName,
  hasRoadmap = true,
  roadmapData,
  onRoadmapUpdate,
  isLoading = false,
}: UserCheckListProps) {
  const router = useRouter();
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [checklistItems, setChecklistItems] = useState<RoadmapChecklist>(
    mockRoadmapData.checklists
  );
  const [apiRoadmapSteps, setApiRoadmapSteps] = useState<
    RoadMapResponse['steps']
  >([]);
  const [editingItem, setEditingItem] = useState<{
    stepId: number;
    itemId: number;
  } | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddingNewItem, setIsAddingNewItem] = useState<boolean>(false);
  const [newItemText, setNewItemText] = useState<string>('');
  const [showCompletionAnimation, setShowCompletionAnimation] =
    useState<boolean>(false);
  const [showFullCompletionAnimation, setShowFullCompletionAnimation] =
    useState<boolean>(false);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [openDropdownItem, setOpenDropdownItem] = useState<{
    stepId: number;
    itemId: number;
  } | null>(null);
  const [deletingItem, setDeletingItem] = useState<{
    stepId: number;
    itemId: number;
  } | null>(null);
  const [isEditRoadmapModalOpen, setIsEditRoadmapModalOpen] =
    useState<boolean>(false);
  const [roadmapInputForm, setRoadmapInputForm] = useState<{
    career: string;
    period: string;
    experience: string;
  }>({
    career: '',
    period: '',
    experience: '',
  });
  const [roadmapInputData, setRoadmapInputData] =
    useState<RoadmapInputResponse | null>(null);
  const [roadmapInputModalError, setRoadmapInputModalError] = useState<
    string | null
  >(null);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] =
    useState<boolean>(false);
  const [categoryForm, setCategoryForm] = useState<
    { roadMapId: number; period: string; category: string }[]
  >([]);
  const [categoryModalError, setCategoryModalError] = useState<string | null>(
    null
  );
  const [isCategorySubmitting, setIsCategorySubmitting] =
    useState<boolean>(false);

  // API 데이터를 UI용 데이터로 변환
  useEffect(() => {
    if (roadmapData) {
      setApiRoadmapSteps(roadmapData.steps);

      // API 데이터를 체크리스트 형태로 변환
      const convertedChecklists: RoadmapChecklist = {};
      roadmapData.steps.forEach((step, stepIndex) => {
        convertedChecklists[stepIndex + 1] = step.actions.map((action) => ({
          id: action.roadMapActionId, // roadMapActionId를 ID로 사용
          text: action.action,
          completed: action.isCompleted,
        }));
      });
      setChecklistItems(convertedChecklists);
    } else {
      // API 데이터가 없으면 빈 배열로 설정하여 기존 UI 표시
      setApiRoadmapSteps([]);
      setChecklistItems(mockRoadmapData.checklists);
    }
  }, [roadmapData]);

  useEffect(() => {
    if (roadmapData?.roadmapInputResponse) {
      setRoadmapInputData(roadmapData.roadmapInputResponse);
    } else {
      setRoadmapInputData(null);
    }
  }, [roadmapData]);

  // 전체 완료 상태 감지
  useEffect(() => {
    if (selectedStepId && checklistItems[selectedStepId]) {
      const currentChecklist = checklistItems[selectedStepId];
      const allCompleted = currentChecklist.every((item) => item.completed);

      // 이미 완료된 단계가 아니고, 모든 항목이 완료되었을 때만 애니메이션 표시
      if (
        allCompleted &&
        !completedSteps.has(selectedStepId) &&
        !showFullCompletionAnimation
      ) {
        setShowFullCompletionAnimation(true);
        setCompletedSteps((prev) => new Set(prev).add(selectedStepId));

        // 애니메이션을 한 번만 보여주기 위해 3초 후 자동으로 false로 설정하고 다음 단계로 이동
        const timer = setTimeout(() => {
          setShowFullCompletionAnimation(false);
          // 다음 단계로 자동 이동
          const nextStepId = selectedStepId + 1;
          const maxStepId = Math.max(
            ...Object.keys(checklistItems).map(Number)
          );
          if (nextStepId <= maxStepId) {
            setSelectedStepId(nextStepId);
          }
        }, 3000);

        return () => clearTimeout(timer);
      }
    } else {
      // 단계가 변경되면 전체 완료 애니메이션 상태 리셋
      setShowFullCompletionAnimation(false);
    }
  }, [
    checklistItems,
    selectedStepId,
    showFullCompletionAnimation,
    completedSteps,
  ]);

  // 개별 완료 애니메이션 자동 종료
  useEffect(() => {
    if (showCompletionAnimation) {
      const timer = setTimeout(() => {
        setShowCompletionAnimation(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showCompletionAnimation]);

  // 다른 곳 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = () => {
      if (openDropdownItem) {
        closeDropdown();
      }
    };

    if (openDropdownItem) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [openDropdownItem]);

  // 로드맵 단계 데이터 변환
  const roadmapSteps = convertApiDataToRoadmapSteps(
    roadmapData
      ? {
          ...roadmapData,
          steps:
            apiRoadmapSteps.length > 0
              ? apiRoadmapSteps
              : roadmapData.steps || [],
        }
      : null,
    USER_MAP_POSITIONS
  );

  const toggleChecklistItem = async (stepId: number, itemId: number) => {
    try {
      setLoading(true);
      setError(null);

      // 현재 항목의 완료 상태 확인
      const currentItem = checklistItems[stepId]?.find(
        (item) => item.id === itemId
      );
      const wasCompleted = currentItem?.completed || false;

      // roadMapActionId를 직접 사용 (itemId가 이미 roadMapActionId)
      await toggleRoadMapAction(itemId);

      // 성공 시 로컬 상태 업데이트
      setChecklistItems((prev: RoadmapChecklist) => ({
        ...prev,
        [stepId]: prev[stepId].map((item: ChecklistItem) =>
          item.id === itemId ? { ...item, completed: !item.completed } : item
        ),
      }));

      // API 데이터도 업데이트
      setApiRoadmapSteps((prev) =>
        prev.map((s, sIndex) =>
          sIndex === stepId - 1
            ? {
                ...s,
                actions: s.actions.map((a) =>
                  a.roadMapActionId === itemId
                    ? { ...a, isCompleted: !a.isCompleted }
                    : a
                ),
              }
            : s
        )
      );

      // 완료 상태로 변경된 경우 애니메이션 트리거
      if (!wasCompleted) {
        setShowCompletionAnimation(true);
      }
    } catch (error) {
      console.error('체크리스트 토글 실패:', error);
      setError(
        error instanceof Error
          ? error.message
          : '체크리스트 토글에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  const updateChecklistItem = async (
    stepId: number,
    itemId: number,
    newText: string
  ) => {
    try {
      setLoading(true);
      setError(null);

      // roadMapActionId를 직접 사용 (itemId가 이미 roadMapActionId)
      await updateRoadmapAction(itemId, newText);

      // 성공 시 로컬 상태 업데이트
      setChecklistItems((prev: RoadmapChecklist) => ({
        ...prev,
        [stepId]: prev[stepId].map((item: ChecklistItem) =>
          item.id === itemId ? { ...item, text: newText } : item
        ),
      }));

      // API 데이터도 업데이트
      setApiRoadmapSteps((prev) =>
        prev.map((s, sIndex) =>
          sIndex === stepId - 1
            ? {
                ...s,
                actions: s.actions.map((a) =>
                  a.roadMapActionId === itemId ? { ...a, action: newText } : a
                ),
              }
            : s
        )
      );

      // 부모 컴포넌트에 업데이트 알림
      if (onRoadmapUpdate) {
        onRoadmapUpdate();
      }
    } catch (error) {
      console.error('체크리스트 수정 실패:', error);
      setError(
        error instanceof Error
          ? error.message
          : '체크리스트 수정에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteChecklistItem = async (stepId: number, itemId: number) => {
    try {
      setLoading(true);
      setError(null);

      // roadMapActionId를 직접 사용 (itemId가 이미 roadMapActionId)
      await deleteRoadmapAction(itemId);

      // 성공 시 로컬 상태 업데이트
      setChecklistItems((prev: RoadmapChecklist) => ({
        ...prev,
        [stepId]: prev[stepId].filter(
          (item: ChecklistItem) => item.id !== itemId
        ),
      }));

      // API 데이터도 업데이트
      setApiRoadmapSteps((prev) =>
        prev.map((s, sIndex) =>
          sIndex === stepId - 1
            ? {
                ...s,
                actions: s.actions.filter((a) => a.roadMapActionId !== itemId),
              }
            : s
        )
      );

      // 부모 컴포넌트에 업데이트 알림
      if (onRoadmapUpdate) {
        onRoadmapUpdate();
      }
    } catch (error) {
      console.error('체크리스트 삭제 실패:', error);
      setError(
        error instanceof Error
          ? error.message
          : '체크리스트 삭제에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoadmap = async () => {
    const confirmed = confirm('로드맵을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await deleteRoadmap();

      setApiRoadmapSteps([]);
      setChecklistItems(mockRoadmapData.checklists);
      setSelectedStepId(null);
      setCompletedSteps(new Set());

      if (onRoadmapUpdate) {
        onRoadmapUpdate();
      }

      router.refresh();
      alert('로드맵이 삭제되었습니다.');
    } catch (error) {
      console.error('로드맵 삭제 실패:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '로드맵 삭제에 실패했습니다. 다시 시도해주세요.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openEditRoadmapModal = () => {
    const source =
      roadmapInputData ?? roadmapData?.roadmapInputResponse ?? null;

    const experienceValue = source?.experience
      ? source.experience
          .split(',')
          .map((item) => item.trim())
          .join('\n')
      : '';

    setRoadmapInputForm({
      career: source?.career ?? '',
      period: source?.period ?? '',
      experience: experienceValue,
    });
    setRoadmapInputModalError(null);
    setIsEditRoadmapModalOpen(true);
  };

  const closeEditRoadmapModal = () => {
    setIsEditRoadmapModalOpen(false);
    setRoadmapInputModalError(null);
  };

  const handleRoadmapInputChange = (
    field: 'career' | 'period' | 'experience',
    value: string
  ) => {
    setRoadmapInputForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmitRoadmapInput = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const source =
      roadmapInputData ?? roadmapData?.roadmapInputResponse ?? null;

    const trimmedCareer = roadmapInputForm.career.trim();
    const trimmedPeriod = roadmapInputForm.period.trim();
    const trimmedExperience = roadmapInputForm.experience
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item !== '')
      .join(', ');

    const payload: RoadMapUpdateRequest = {};

    if (!source || trimmedCareer !== (source.career ?? '')) {
      payload.career = trimmedCareer;
    }

    if (!source || trimmedPeriod !== (source.period ?? '')) {
      payload.period = trimmedPeriod;
    }

    if (!source || trimmedExperience !== (source.experience ?? '')) {
      payload.experience = trimmedExperience;
    }

    if (Object.keys(payload).length === 0) {
      alert('변경된 내용이 없습니다.');
      return;
    }

    try {
      setLoading(true);
      setRoadmapInputModalError(null);

      await updateRoadmapInput(payload);

      setRoadmapInputData((prev) => {
        const base = prev ??
          roadmapData?.roadmapInputResponse ?? {
            career: '',
            period: '',
            experience: '',
            dday: 0,
          };
        return {
          ...base,
          ...payload,
        };
      });

      if (onRoadmapUpdate) {
        onRoadmapUpdate();
      }

      router.refresh();
      alert('취업 정보가 업데이트되었습니다.');
      closeEditRoadmapModal();
    } catch (error) {
      console.error('로드맵 정보 수정 실패:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '로드맵 정보를 수정하지 못했습니다. 다시 시도해주세요.';
      setRoadmapInputModalError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openEditCategoryModal = () => {
    const sourceSteps =
      apiRoadmapSteps.length > 0 ? apiRoadmapSteps : (roadmapData?.steps ?? []);

    if (sourceSteps.length === 0) {
      alert('수정할 로드맵 단계가 없습니다.');
      return;
    }

    setCategoryForm(
      sourceSteps.map((step) => ({
        roadMapId: step.roadMapId,
        period: step.period ?? '',
        category: step.category ?? '',
      }))
    );
    setCategoryModalError(null);
    setIsEditCategoryModalOpen(true);
  };

  const closeEditCategoryModal = () => {
    setIsEditCategoryModalOpen(false);
    setCategoryModalError(null);
    setCategoryForm([]);
  };

  const handleCategoryFieldChange = (roadMapId: number, value: string) => {
    setCategoryForm((prev) =>
      prev.map((item) =>
        item.roadMapId === roadMapId ? { ...item, category: value } : item
      )
    );
  };

  const handleSubmitCategoryForm = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (categoryForm.length === 0) {
      closeEditCategoryModal();
      return;
    }

    const trimmedForm = categoryForm.map((item) => ({
      ...item,
      category: item.category.trim(),
    }));

    if (trimmedForm.some((item) => item.category.length === 0)) {
      setCategoryModalError('카테고리는 비워둘 수 없습니다.');
      return;
    }

    const baselineSteps =
      apiRoadmapSteps.length > 0 ? apiRoadmapSteps : (roadmapData?.steps ?? []);

    const updates = trimmedForm.filter((item) => {
      const baseline = baselineSteps.find(
        (step) => step.roadMapId === item.roadMapId
      );
      return baseline ? item.category !== (baseline.category ?? '') : false;
    });

    if (updates.length === 0) {
      alert('변경된 카테고리가 없습니다.');
      return;
    }

    try {
      setIsCategorySubmitting(true);
      setCategoryModalError(null);

      const payload = {
        roadmapList: updates.map((item) => ({
          roadmapId: String(item.roadMapId),
          category: item.category,
        })),
      };

      await updateRoadmapCategory(payload);

      setApiRoadmapSteps((prev) =>
        prev.map((step) => {
          const update = updates.find(
            (item) => item.roadMapId === step.roadMapId
          );
          return update ? { ...step, category: update.category } : step;
        })
      );

      if (onRoadmapUpdate) {
        onRoadmapUpdate();
      }

      router.refresh();
      alert('로드맵 카테고리가 업데이트되었습니다.');
      closeEditCategoryModal();
    } catch (error) {
      console.error('로드맵 카테고리 수정 실패:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : '로드맵 카테고리를 수정하지 못했습니다. 다시 시도해주세요.';
      setCategoryModalError(errorMessage);
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const displayCareer =
    roadmapInputData?.career ??
    roadmapData?.roadmapInputResponse.career ??
    defaultCareerInfo.jobTitle;
  const displayPeriod =
    roadmapInputData?.period ??
    roadmapData?.roadmapInputResponse.period ??
    defaultCareerInfo.targetPeriod;
  const displayExperience =
    roadmapInputData?.experience ??
    roadmapData?.roadmapInputResponse.experience ??
    defaultCareerInfo.experience;
  const parsedDefaultDday = parseInt(
    defaultCareerInfo.dDay?.replace(/[^0-9-]/g, '') || '0',
    10
  );
  const fallbackDday = Number.isNaN(parsedDefaultDday) ? 0 : parsedDefaultDday;
  const displayDday =
    roadmapInputData?.dday ??
    roadmapData?.roadmapInputResponse.dday ??
    fallbackDday;

  const startEditing = (
    stepId: number,
    itemId: number,
    currentText: string
  ) => {
    setEditingItem({ stepId, itemId });
    setEditText(currentText);
  };

  const cancelEditing = () => {
    setEditingItem(null);
    setEditText('');
    closeDropdown();
  };

  const saveEditing = async () => {
    if (editingItem) {
      await updateChecklistItem(
        editingItem.stepId,
        editingItem.itemId,
        editText
      );
      setEditingItem(null);
      setEditText('');
      closeDropdown();
    }
  };

  const startAddingNewItem = () => {
    setIsAddingNewItem(true);
    setNewItemText('');
  };

  const cancelAddingNewItem = () => {
    setIsAddingNewItem(false);
    setNewItemText('');
  };

  const addNewChecklistItem = async (stepId: number, actionText: string) => {
    try {
      setLoading(true);
      setError(null);

      // roadmapId는 현재 선택된 단계의 roadmapId를 사용
      const currentStep = apiRoadmapSteps[stepId - 1];
      if (!currentStep || !currentStep.roadMapId) {
        throw new Error('로드맵 ID를 찾을 수 없습니다.');
      }

      await addRoadmapAction(currentStep.roadMapId, actionText);

      // 성공 시 로컬 상태 업데이트 (임시 ID로 추가, 실제로는 서버에서 받은 ID를 사용해야 함)
      const tempId = Date.now(); // 임시 ID
      const newItem: ChecklistItem = {
        id: tempId,
        text: actionText,
        completed: false,
      };

      setChecklistItems((prev: RoadmapChecklist) => ({
        ...prev,
        [stepId]: [...(prev[stepId] || []), newItem],
      }));

      // API 데이터도 업데이트 (임시로 추가)
      setApiRoadmapSteps((prev) =>
        prev.map((s, sIndex) =>
          sIndex === stepId - 1
            ? {
                ...s,
                actions: [
                  ...s.actions,
                  {
                    roadMapActionId: tempId,
                    action: actionText,
                    isCompleted: false,
                  },
                ],
              }
            : s
        )
      );

      // 부모 컴포넌트에 업데이트 알림
      if (onRoadmapUpdate) {
        onRoadmapUpdate();
      }

      setIsAddingNewItem(false);
      setNewItemText('');
    } catch (error) {
      console.error('새 항목 추가 실패:', error);
      setError(
        error instanceof Error ? error.message : '새 항목 추가에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  const saveNewItem = async () => {
    if (newItemText.trim() && selectedStepId) {
      await addNewChecklistItem(selectedStepId, newItemText.trim());
    }
  };

  const toggleDropdown = (stepId: number, itemId: number) => {
    setOpenDropdownItem(
      openDropdownItem?.stepId === stepId && openDropdownItem?.itemId === itemId
        ? null
        : { stepId, itemId }
    );
  };

  const closeDropdown = () => {
    setOpenDropdownItem(null);
  };

  const startDeleting = (stepId: number, itemId: number) => {
    setDeletingItem({ stepId, itemId });
    closeDropdown();
  };

  const cancelDeleting = () => {
    setDeletingItem(null);
  };

  const confirmDelete = async () => {
    if (deletingItem) {
      await deleteChecklistItem(deletingItem.stepId, deletingItem.itemId);
      setDeletingItem(null);
    }
  };

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white/60 backdrop-blur-lg z-40 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Image
            src="/assets/Icons/character_running.webp"
            alt="loading"
            width={328}
            height={293}
            className="mb-8 md:mb-16 w-[200px] h-auto md:w-[328px]"
          />
          <p className="text-2xl md:text-3xl font-semibold text-gray-50">
            로드맵 불러오는중
          </p>
        </div>
      </div>
    );
  }

  // 로드맵이 없거나 API 데이터가 없거나 로그인하지 않은 경우
  if (!userName || !hasRoadmap || !roadmapData) {
    // 로드맵이 없는 경우 또는 로그인하지 않은 경우 - 단순한 중앙 정렬 레이아웃
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] py-12">
        {/* 캐릭터 이미지 */}
        <div className="mb-6 md:mb-8">
          <Image
            src="/assets/Icons/character_roadmap.png"
            alt="로드맵 캐릭터"
            width={300}
            height={300}
            className="w-auto h-[200px] md:h-[250px] lg:h-[300px] object-contain"
          />
        </div>

        {/* 생성 버튼 */}
        <button
          onClick={() => router.push('/ai-chat/roadmap')}
          className="bg-primary-90 hover:bg-green-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-2xl text-base md:text-lg lg:text-title-large font-medium transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          꿈별이와 함께 로드맵 생성하기
        </button>
      </div>
    );
  }

  // 로드맵이 있는 경우 - 왼쪽에 로드맵, 오른쪽에 두 개의 카드
  return (
    <>
      {isEditCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 md:p-8 relative">
            <button
              type="button"
              onClick={closeEditCategoryModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              aria-label="닫기"
            >
              ×
            </button>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              로드맵 카테고리 수정
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-6">
              각 단계의 카테고리 이름을 수정해 주세요.
            </p>
            {categoryModalError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {categoryModalError}
              </div>
            )}
            <form onSubmit={handleSubmitCategoryForm} className="space-y-5">
              {categoryForm.map((item, index) => (
                <div key={item.roadMapId}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {index + 1}단계 {item.period ? `(${item.period})` : '( )'}
                  </label>
                  <input
                    type="text"
                    value={item.category}
                    onChange={(event) =>
                      handleCategoryFieldChange(
                        item.roadMapId,
                        event.target.value
                      )
                    }
                    placeholder="예: 교육"
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm md:text-base shadow-sm focus:border-primary-80 focus:outline-none focus:ring-2 focus:ring-primary-80/30 transition"
                    disabled={isCategorySubmitting}
                  />
                </div>
              ))}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditCategoryModal}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm md:text-base text-gray-600 hover:bg-gray-100 transition"
                  disabled={isCategorySubmitting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary-90 px-5 py-2 text-sm md:text-base text-white shadow hover:bg-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={isCategorySubmitting}
                >
                  {isCategorySubmitting ? '수정 중...' : '수정하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isEditRoadmapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl p-6 md:p-8 relative">
            <button
              type="button"
              onClick={closeEditRoadmapModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
              aria-label="닫기"
            >
              ×
            </button>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-4">
              로드맵 정보 수정
            </h2>
            <p className="text-gray-500 text-sm md:text-base mb-6">
              목표 직무, 취업 기간, 보유 경험 정보를 수정해 주세요.
            </p>
            {/* {roadmapInputModalError && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {roadmapInputModalError}
              </div>
            )} */}
            <form onSubmit={handleSubmitRoadmapInput} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  목표 직무
                </label>
                <input
                  type="text"
                  value={roadmapInputForm.career}
                  onChange={(event) =>
                    handleRoadmapInputChange('career', event.target.value)
                  }
                  placeholder="예: 백엔드 개발자 전향"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm md:text-base shadow-sm focus:border-primary-80 focus:outline-none focus:ring-2 focus:ring-primary-80/30 transition"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  목표 취업 기간
                </label>
                <input
                  type="text"
                  value={roadmapInputForm.period}
                  onChange={(event) =>
                    handleRoadmapInputChange('period', event.target.value)
                  }
                  placeholder="예: 6개월"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm md:text-base shadow-sm focus:border-primary-80 focus:outline-none focus:ring-2 focus:ring-primary-80/30 transition"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  보유 경험/자격증
                </label>
                <textarea
                  value={roadmapInputForm.experience}
                  onChange={(event) =>
                    handleRoadmapInputChange('experience', event.target.value)
                  }
                  placeholder={
                    '보유 경험 또는 자격증을 줄바꿈으로 구분해 입력해 주세요.\n예: 정보처리기사\n예: 사이드 프로젝트 경험'
                  }
                  rows={5}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm md:text-base shadow-sm focus:border-primary-80 focus:outline-none focus:ring-2 focus:ring-primary-80/30 transition resize-none"
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-gray-400">
                  줄바꿈으로 구분한 항목은 목록 형태로 표시됩니다.
                </p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeEditRoadmapModal}
                  className="rounded-xl border border-gray-200 px-4 py-2 text-sm md:text-base text-gray-600 hover:bg-gray-100 transition"
                  disabled={loading}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary-90 px-5 py-2 text-sm md:text-base text-white shadow hover:bg-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  수정하기
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 전체 완료 애니메이션 (큰 크기) */}
      <CompletionAnimation
        isVisible={showFullCompletionAnimation}
        onComplete={() => setShowFullCompletionAnimation(false)}
        duration={3000}
        lottieUrl="https://lottie.host/f2b25a20-fa49-4d95-b67c-1018e89ad205/6YAM5nWWhK.lottie"
        width="100vw"
        height="100vh"
      />
      <div className="flex flex-col xl:flex-row xl:items-stretch gap-4">
        {/* 왼쪽 - 로드맵 시각화 */}
        <RoadmapBackground className="w-full aspect-[588/860] xl:w-[588px] xl:aspect-auto xl:h-[860px] flex-shrink-0 relative">
          {/* 로드맵 헤더와 수정/삭제 버튼 */}
          <div className="flex justify-between mb-4 sm:mb-8">
            <RoadmapHeader userName={userName} multiLine={true} />
            {/* 로드맵 수정/삭제 버튼 */}
            <div className="flex gap-2">
              <button
                onClick={openEditCategoryModal}
                className="w-12 h-12 rounded-full bg-white/40 hover:bg-[#E1F5EC]/40 flex justify-center transition-colors"
                aria-label="로드맵 카테고리 수정"
              >
                <Image
                  src="/assets/Icons/drop-edit.svg"
                  alt="수정"
                  width={24}
                  height={24}
                />
              </button>
              <button
                onClick={handleDeleteRoadmap}
                disabled={loading}
                className="w-12 h-12 rounded-full bg-white/40 hover:bg-[#E1F5EC]/40 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="로드맵 삭제"
              >
                <Image
                  src="/assets/Icons/drop-delete.svg"
                  alt="삭제"
                  width={24}
                  height={24}
                />
              </button>
            </div>
          </div>

          {/* 로드맵 차트 */}
          <div className="flex-1 relative flex items-center justify-center">
            {/* 연결선들 */}
            <svg
              className="absolute inset-0 w-full h-full z-10"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              {roadmapSteps.length > 0
                ? roadmapSteps.map((step, index) => {
                    if (index === roadmapSteps.length - 1) return null;
                    const nextStep = roadmapSteps[index + 1];
                    return (
                      <path
                        key={`line-${index}`}
                        d={`M ${step.position.x} ${step.position.y} L ${nextStep.position.x} ${nextStep.position.y}`}
                        stroke="white"
                        strokeWidth={2}
                        fill="none"
                      />
                    );
                  })
                : mockRoadmapData.steps.map((step, index) => {
                    if (index === mockRoadmapData.steps.length - 1) return null;
                    const position = USER_MAP_POSITIONS[index] || {
                      x: 50,
                      y: 50,
                    };
                    const nextPosition = USER_MAP_POSITIONS[index + 1] || {
                      x: 50,
                      y: 50,
                    };
                    return (
                      <path
                        key={`line-${index}`}
                        d={`M ${position.x} ${position.y} L ${nextPosition.x} ${nextPosition.y}`}
                        stroke="white"
                        strokeWidth={1}
                        fill="none"
                      />
                    );
                  })}
            </svg>

            {/* 로드맵 단계들 */}
            {roadmapSteps.length > 0
              ? roadmapSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="absolute flex flex-col items-center z-20"
                    style={{
                      left: `${step.position.x}%`,
                      top: `${step.position.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="mb-2">
                      <RoadmapPosition
                        isCompleted={step.completed}
                        isPressed={selectedStepId === step.id}
                        onClick={() => setSelectedStepId(step.id)}
                      />
                    </div>
                    <span
                      className="text-white text-sm sm:text-base md:text-lg lg:text-2xl xl:text-4xl whitespace-nowrap font-regular"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: index === 1 ? '-100px' : '60px',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      {step.name}
                    </span>
                  </div>
                ))
              : mockRoadmapData.steps.map((step, index) => {
                  const position = USER_MAP_POSITIONS[index] || {
                    x: 50,
                    y: 50,
                  };

                  return (
                    <div
                      key={step.id}
                      className="absolute flex flex-col items-center z-20"
                      style={{
                        left: `${position.x}%`,
                        top: `${position.y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className="mb-2">
                        <RoadmapPosition
                          isCompleted={step.completed}
                          isPressed={selectedStepId === step.id}
                          onClick={() => setSelectedStepId(step.id)}
                        />
                      </div>
                      <span
                        className="text-white text-sm sm:text-base md:text-lg lg:text-2xl xl:text-4xl whitespace-nowrap font-regular"
                        style={{
                          position: 'absolute',
                          top: '50%',
                          left: index === 1 ? '-60px' : '60px',
                          transform: 'translateY(-50%)',
                        }}
                      >
                        {step.name}
                      </span>
                    </div>
                  );
                })}
          </div>
        </RoadmapBackground>

        {/* 오른쪽 - 두 개의 카드 (세로 배치) */}
        <div className="flex flex-col gap-4 w-full xl:h-full">
          {/* 상단 카드 - 취업 정보 */}
          <div
            className="bg-white rounded-2xl md:rounded-3xl py-4 px-4 md:py-6 md:px-8 h-auto min-h-[200px] md:h-60 w-full bg-white flex-shrink-0 relative"
            style={{
              boxShadow: '0 4px 10px 0 rgba(17, 17, 17, 0.20)',
            }}
          >
            <div className="flex flex-col md:flex-row h-full">
              {/* 왼쪽 섹션 */}
              <div className="flex-[2] flex flex-col justify-between mb-4 md:mb-0">
                <div>
                  <div className="flex items-center gap-2 mb-2 justify-between">
                    <div className="text-primary-90 font-semibold text-base md:text-2xl lg:text-3xl xl:text-4xl leading-tight">
                      D+{displayDday}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={openEditRoadmapModal}
                        disabled={loading}
                        className="w-12 h-12 rounded-full border border-gray-200 bg-white/40 hover:bg-[#E1F5EC]/40 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="취업 정보 수정"
                      >
                        <Image
                          src="/assets/Icons/drop-edit.svg"
                          alt="수정"
                          width={24}
                          height={24}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-800 text-sm md:text-xl lg:text-3xl xl:text-title-xlarge">
                    {displayCareer}
                  </div>
                </div>

                <div className="flex flex-col mt-4 md:mt-0">
                  <div className="text-gray-50 text-xs md:text-sm lg:text-body-medium">
                    목표 취업 기간
                  </div>
                  <div className="text-gray-800 text-sm md:text-base lg:text-body-large">
                    {displayPeriod}
                  </div>
                </div>
              </div>

              {/* 세로 구분선 */}
              <div className="hidden md:block w-px bg-gray-200 mx-4"></div>
              <div className="md:hidden w-full h-px bg-gray-200 my-4"></div>

              {/* 오른쪽 섹션 */}
              <div className="flex-1 flex flex-col">
                <div className="text-primary-90 text-xs md:text-sm lg:text-body-medium mb-2 md:mb-4">
                  보유 경험/자격증
                </div>
                <div className="text-gray-800 text-sm md:text-base lg:text-body-large space-y-1 md:space-y-2">
                  {displayExperience
                    ?.split(',')
                    .map((item) => item.trim())
                    .filter((item) => item.length > 0)
                    .map((item, index) => (
                      <div key={index}>{item}</div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* 하단 카드 - 안내 및 체크리스트 */}
          <div
            className="bg-white rounded-2xl p-4 md:p-6 relative w-full aspect-square xl:w-auto xl:h-full bg-white"
            style={{
              boxShadow: '0 4px 10px 0 rgba(17, 17, 17, 0.20)',
            }}
          >
            {/* 개별 항목 완료 애니메이션 (카드 내부) */}
            {showCompletionAnimation && (
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                <div className="relative">
                  <DotLottieReact
                    src="https://lottie.host/e0634298-f1dc-4561-82eb-90cf7f64d5af/Cmarc8qPeg.lottie"
                    loop={false}
                    autoplay={true}
                    style={{
                      width: '120px',
                      height: '120px',
                    }}
                  />
                </div>
              </div>
            )}
            {selectedStepId ? (
              // 체크리스트 표시
              <div className="h-full flex flex-col">
                <div className="flex flex-col md:flex-row items-start md:items-end gap-2 mb-2 md:mb-0 flex-shrink-0">
                  <div className="text-primary-90 text-base md:text-xl lg:text-2xl xl:text-header-medium">
                    {apiRoadmapSteps.length > 0
                      ? `${apiRoadmapSteps[selectedStepId - 1]?.category || '단계'}`
                      : mockRoadmapData.steps.find(
                          (step) => step.id === selectedStepId
                        )?.name || '단계'}
                    하기
                  </div>
                  <div className="text-gray-50 text-xs md:text-sm lg:text-base xl:text-body-large-regular">
                    {(() => {
                      const currentChecklist = checklistItems[selectedStepId];
                      const allCompleted = currentChecklist?.every(
                        (item) => item.completed
                      );

                      if (allCompleted) {
                        return '모두 완료했어요! 다음 단계의 별을 눌러보세요!';
                      } else {
                        return '넥스트 커리어에 첫 걸음을 내딛어 봐요!';
                      }
                    })()}
                  </div>
                </div>

                <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
                  {/* 에러 메시지 */}
                  {error && (
                    <div className="mb-4 p-2 md:p-3 bg-red-100 border border-red-300 rounded-lg flex-shrink-0">
                      <p className="text-red-700 text-xs md:text-sm lg:text-body-medium">
                        {error}
                      </p>
                      <button
                        onClick={() => setError(null)}
                        className="mt-2 text-red-600 text-xs md:text-body-small hover:underline"
                      >
                        닫기
                      </button>
                    </div>
                  )}
                  {/* 로딩 상태 */}
                  {/* {loading && (
                    <div className="mb-4 flex items-center justify-center">
                      <CompletionAnimation
                        isVisible={loading}
                        lottieUrl="https://lottie.host/0f0671f1-cd41-46c7-8bec-b4ee6d9eac7d/55urjx7CQ5.lottie"
                        width="80px"
                        height="80px"
                        duration={0}
                      />
                    </div>
                  )} */}
                  <div className="space-y-2 md:space-y-3 lg:space-y-4 pr-2">
                    {checklistItems[selectedStepId]?.map((item) => {
                      const isEditing =
                        editingItem?.stepId === selectedStepId &&
                        editingItem?.itemId === item.id;

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 md:gap-4"
                        >
                          <div className="flex flex-col items-center">
                            <button
                              onClick={() =>
                                toggleChecklistItem(selectedStepId, item.id)
                              }
                              disabled={loading}
                              className="hover:scale-110 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {item.completed ? (
                                <HiStar
                                  className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8"
                                  style={{ color: 'var(--color-secondary2)' }}
                                />
                              ) : (
                                <PiStarThin
                                  className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8"
                                  style={{ color: 'var(--color-secondary2)' }}
                                />
                              )}
                            </button>
                          </div>
                          <div className="flex-1">
                            {isEditing ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  className="flex-1 px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-lg text-sm md:text-sm lg:text-body-large"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      saveEditing();
                                    } else if (e.key === 'Escape') {
                                      cancelEditing();
                                    }
                                  }}
                                  autoFocus
                                />
                                <div className="flex gap-1 md:gap-2">
                                  <button
                                    onClick={saveEditing}
                                    disabled={loading}
                                    className="px-1.5 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    확인
                                  </button>
                                  <button
                                    onClick={cancelEditing}
                                    disabled={loading}
                                    className="px-1.5 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    취소
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span
                                  className={`text-sm md:text-sm lg:text-body-large cursor-pointer flex-1 ${
                                    item.completed
                                      ? 'text-gray-500 line-through'
                                      : 'text-gray-800'
                                  }`}
                                  onClick={() =>
                                    toggleChecklistItem(selectedStepId, item.id)
                                  }
                                >
                                  {item.text}
                                </span>
                                {openDropdownItem?.stepId === selectedStepId &&
                                openDropdownItem?.itemId === item.id ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => {
                                        startEditing(
                                          selectedStepId,
                                          item.id,
                                          item.text
                                        );
                                        closeDropdown();
                                      }}
                                      disabled={loading}
                                      className="px-1.5 py-0.5 md:px-2 md:py-1 text-[9px] md:text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      수정
                                    </button>
                                    <button
                                      onClick={() => {
                                        startDeleting(selectedStepId, item.id);
                                      }}
                                      disabled={loading}
                                      className="px-1.5 py-0.5 md:px-2 md:py-1 text-[9px] md:text-xs bg-red-100 text-red-700 rounded-full hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      삭제
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() =>
                                      toggleDropdown(selectedStepId, item.id)
                                    }
                                    disabled={loading}
                                    className="p-1 hover:bg-gray-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <IoMdMore className="w-3.5 h-3.5 md:w-5 md:h-5 text-gray-500" />
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* 추가 목표 항목 */}
                    {isAddingNewItem ? (
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex flex-col items-center">
                          <button className="hover:scale-110 transition-transform cursor-pointer">
                            <PiStarThin className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-300" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newItemText}
                              onChange={(e) => setNewItemText(e.target.value)}
                              placeholder="새로운 목표를 입력하세요"
                              className="flex-1 px-2 py-1.5 md:px-3 md:py-2 border border-gray-300 rounded-lg text-sm md:text-sm lg:text-body-large"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  saveNewItem();
                                } else if (e.key === 'Escape') {
                                  cancelAddingNewItem();
                                }
                              }}
                              autoFocus
                            />
                            <button
                              onClick={saveNewItem}
                              disabled={loading || !newItemText.trim()}
                              className="px-1.5 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              확인
                            </button>
                            <button
                              onClick={cancelAddingNewItem}
                              disabled={loading}
                              className="px-1.5 py-0.5 md:px-3 md:py-1 text-[9px] md:text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              취소
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 md:gap-4">
                        <div className="flex flex-col items-center">
                          <button
                            onClick={startAddingNewItem}
                            disabled={loading}
                            className="hover:scale-110 transition-transform cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <PiStarThin className="w-5 h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-gray-300" />
                          </button>
                        </div>
                        <div className="flex-1">
                          <span className="text-sm md:text-sm lg:text-body-large text-gray-800">
                            별을 눌러 직접 목표를 추가해보세요!
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* <div className="absolute top-2 right-2 md:ftop-4 md:right-4">
                  <Image
                    src="/assets/Icons/character_cheer.png"
                    alt="응원하는 별 캐릭터"
                    width={134}
                    height={134}
                    className="w-auto h-12 md:h-24 lg:h-32 xl:h-[134px]"
                  />
                </div> */}
              </div>
            ) : (
              // 기본 안내 메시지
              <div className="h-full flex flex-col justify-center items-center">
                <div className="text-gray-800 text-sm md:text-lg lg:text-4xl lg:font-semibold xl:text-title-xlarge mb-4 px-4 text-center">
                  로드맵의 동그라미를 눌러서
                  <br />
                  진행도를 확인하세요!
                </div>
                <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4">
                  <Image
                    src="/assets/Icons/character_cheer.png"
                    alt="응원하는 별 캐릭터"
                    width={134}
                    height={134}
                    className="w-auto h-12 md:h-24 lg:h-32 xl:h-[134px]"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* 삭제 확인 모달 */}
      <DeleteConfirmModal
        isOpen={deletingItem !== null}
        onClose={cancelDeleting}
        onConfirm={confirmDelete}
      />
    </>
  );
}
