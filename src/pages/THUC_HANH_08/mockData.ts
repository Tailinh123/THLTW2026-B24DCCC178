



import type { WorkoutEntry, HealthRecord, Goal, Exercise } from './types';

const uid = () => Math.random().toString(36).slice(2, 9);
export const genId = () => `th08_${uid()}`;


const KEYS = {
  workouts: 'th08_workouts',
  health: 'th08_health',
  goals: 'th08_goals',
  exercises: 'th08_exercises',
};


const today = new Date();
const dateStr = (daysAgo: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

export const MOCK_WORKOUTS: WorkoutEntry[] = [
  { id: 'w1', date: dateStr(0), type: 'Cardio', exerciseName: 'Chạy bộ buổi sáng', duration: 35, calories: 320, notes: 'Chạy 5km quanh công viên', status: 'completed' },
  { id: 'w2', date: dateStr(1), type: 'Strength', exerciseName: 'Đẩy ngực + Tay sau', duration: 50, calories: 280, notes: 'Bench press 4x10, Dips 3x12', status: 'completed' },
  { id: 'w3', date: dateStr(2), type: 'Yoga', exerciseName: 'Yoga buổi tối', duration: 45, calories: 150, notes: 'Flow yoga giảm stress', status: 'completed' },
  { id: 'w4', date: dateStr(3), type: 'HIIT', exerciseName: 'HIIT Tabata', duration: 25, calories: 350, notes: '8 rounds, 20s on / 10s off', status: 'completed' },
  { id: 'w5', date: dateStr(4), type: 'Cardio', exerciseName: 'Đạp xe', duration: 40, calories: 280, notes: 'Đạp xe đường dài 15km', status: 'completed' },
  { id: 'w6', date: dateStr(5), type: 'Strength', exerciseName: 'Squat + Deadlift', duration: 55, calories: 320, notes: 'Leg day! Squat 5x5, DL 3x8', status: 'completed' },
  { id: 'w7', date: dateStr(6), type: 'Other', exerciseName: 'Bơi lội', duration: 60, calories: 400, notes: 'Bơi tự do 1500m', status: 'completed' },
  { id: 'w8', date: dateStr(7), type: 'Cardio', exerciseName: 'Chạy bộ interval', duration: 30, calories: 350, notes: 'Sprint 200m x 8 lần', status: 'completed' },
  { id: 'w9', date: dateStr(8), type: 'Strength', exerciseName: 'Vai + Tay trước', duration: 45, calories: 250, notes: 'OHP 4x8, Curl 3x12', status: 'completed' },
  { id: 'w10', date: dateStr(10), type: 'HIIT', exerciseName: 'Burpee Challenge', duration: 20, calories: 300, notes: '100 burpees for time', status: 'completed' },
  { id: 'w11', date: dateStr(9), type: 'Yoga', exerciseName: 'Yoga phục hồi', duration: 30, calories: 100, notes: 'Yin yoga, kéo giãn sâu', status: 'missed' },
  { id: 'w12', date: dateStr(12), type: 'Cardio', exerciseName: 'Nhảy dây', duration: 20, calories: 220, notes: '1000 lần nhảy', status: 'completed' },
  { id: 'w13', date: dateStr(14), type: 'Strength', exerciseName: 'Pull day', duration: 50, calories: 270, notes: 'Pull-ups 5x8, Rows 4x10', status: 'completed' },
  { id: 'w14', date: dateStr(16), type: 'HIIT', exerciseName: 'Circuit Training', duration: 30, calories: 380, notes: '5 vòng, 6 bài tập', status: 'completed' },
  { id: 'w15', date: dateStr(18), type: 'Cardio', exerciseName: 'Chạy bộ buổi sáng', duration: 40, calories: 360, notes: 'Tempo run 6km', status: 'completed' },
  { id: 'w16', date: dateStr(20), type: 'Other', exerciseName: 'Leo núi', duration: 120, calories: 600, notes: 'Trail hiking 8km', status: 'completed' },
  { id: 'w17', date: dateStr(22), type: 'Strength', exerciseName: 'Full body', duration: 60, calories: 350, notes: 'Compound movements', status: 'missed' },
  { id: 'w18', date: dateStr(25), type: 'Yoga', exerciseName: 'Power Yoga', duration: 50, calories: 200, notes: 'Vinyasa flow nâng cao', status: 'completed' },
  { id: 'w19', date: dateStr(28), type: 'Cardio', exerciseName: 'Chạy bộ', duration: 30, calories: 280, notes: 'Easy run 4km', status: 'completed' },
  { id: 'w20', date: dateStr(30), type: 'HIIT', exerciseName: 'Crossfit WOD', duration: 35, calories: 420, notes: 'AMRAP 20 phút', status: 'completed' },
  { id: 'w21', date: dateStr(35), type: 'Strength', exerciseName: 'Push day', duration: 45, calories: 260, notes: 'Bench + OHP + Flyes', status: 'completed' },
  { id: 'w22', date: dateStr(40), type: 'Cardio', exerciseName: 'Đạp xe leo đồi', duration: 50, calories: 350, notes: 'Hill climbs 20km', status: 'completed' },
];


export const MOCK_HEALTH: HealthRecord[] = [
  { id: 'h1', date: dateStr(0), weight: 72.0, height: 175, bmi: 23.51, heartRate: 68, sleepHours: 7.5 },
  { id: 'h2', date: dateStr(3), weight: 72.3, height: 175, bmi: 23.61, heartRate: 70, sleepHours: 7.0 },
  { id: 'h3', date: dateStr(7), weight: 72.8, height: 175, bmi: 23.78, heartRate: 72, sleepHours: 6.5 },
  { id: 'h4', date: dateStr(10), weight: 73.0, height: 175, bmi: 23.84, heartRate: 69, sleepHours: 8.0 },
  { id: 'h5', date: dateStr(14), weight: 73.2, height: 175, bmi: 23.90, heartRate: 71, sleepHours: 7.0 },
  { id: 'h6', date: dateStr(17), weight: 73.5, height: 175, bmi: 24.00, heartRate: 67, sleepHours: 7.5 },
  { id: 'h7', date: dateStr(21), weight: 73.8, height: 175, bmi: 24.10, heartRate: 73, sleepHours: 6.0 },
  { id: 'h8', date: dateStr(24), weight: 74.0, height: 175, bmi: 24.16, heartRate: 70, sleepHours: 7.0 },
  { id: 'h9', date: dateStr(28), weight: 74.2, height: 175, bmi: 24.23, heartRate: 68, sleepHours: 7.5 },
  { id: 'h10', date: dateStr(31), weight: 74.5, height: 175, bmi: 24.33, heartRate: 72, sleepHours: 8.0 },
  { id: 'h11', date: dateStr(35), weight: 74.8, height: 175, bmi: 24.42, heartRate: 74, sleepHours: 6.5 },
  { id: 'h12', date: dateStr(38), weight: 75.0, height: 175, bmi: 24.49, heartRate: 70, sleepHours: 7.0 },
  { id: 'h13', date: dateStr(42), weight: 75.3, height: 175, bmi: 24.59, heartRate: 69, sleepHours: 7.5 },
  { id: 'h14', date: dateStr(45), weight: 75.5, height: 175, bmi: 24.65, heartRate: 71, sleepHours: 7.0 },
  { id: 'h15', date: dateStr(50), weight: 76.0, height: 175, bmi: 24.82, heartRate: 73, sleepHours: 6.5 },
];


export const MOCK_GOALS: Goal[] = [
  { id: 'g1', name: 'Giảm cân xuống 70kg', type: 'weight_loss', targetValue: 70, currentValue: 72, unit: 'kg', deadline: dateStr(-30), status: 'active' },
  { id: 'g2', name: 'Tập 20 buổi trong tháng', type: 'workout_count', targetValue: 20, currentValue: 15, unit: 'buổi', deadline: dateStr(-5), status: 'active' },
  { id: 'g3', name: 'Đốt 10,000 calo', type: 'calories_burned', targetValue: 10000, currentValue: 10000, unit: 'kcal', deadline: dateStr(10), status: 'completed' },
  { id: 'g4', name: 'Chạy 50km trong tháng', type: 'running_distance', targetValue: 50, currentValue: 32, unit: 'km', deadline: dateStr(-7), status: 'active' },
  { id: 'g5', name: 'Ngủ đủ 8h mỗi ngày', type: 'sleep_hours', targetValue: 8, currentValue: 7.2, unit: 'giờ/ngày', deadline: dateStr(-15), status: 'failed' },
  { id: 'g6', name: 'Tập 15 buổi tháng trước', type: 'workout_count', targetValue: 15, currentValue: 15, unit: 'buổi', deadline: dateStr(20), status: 'completed' },
];


export const MOCK_EXERCISES: Exercise[] = [
  { id: 'e1', name: 'Chạy bộ', muscleGroup: 'Chân', difficulty: 'Beginner', description: 'Bài tập cardio cơ bản, phù hợp mọi trình độ.', instructions: '1. Khởi động 5 phút đi bộ nhanh\n2. Chạy với tốc độ vừa phải 20-30 phút\n3. Hạ nhiệt 5 phút đi bộ chậm\n4. Giãn cơ chân sau khi chạy', caloriesPerHour: 500 },
  { id: 'e2', name: 'Bench Press', muscleGroup: 'Ngực', difficulty: 'Intermediate', description: 'Bài tập đẩy ngực với tạ đòn, phát triển cơ ngực và tay sau.', instructions: '1. Nằm trên ghế, grip rộng hơn vai\n2. Hạ tạ xuống ngực, hít vào\n3. Đẩy tạ lên, thở ra\n4. Thực hiện 4 sets x 8-12 reps', caloriesPerHour: 350 },
  { id: 'e3', name: 'Squat', muscleGroup: 'Chân', difficulty: 'Intermediate', description: 'Vua của các bài tập chân, phát triển đùi trước, đùi sau và mông.', instructions: '1. Đứng chân rộng bằng vai, tạ trên vai\n2. Hạ người xuống song song mặt đất\n3. Đẩy người lên về vị trí ban đầu\n4. Thực hiện 5 sets x 5 reps', caloriesPerHour: 400 },
  { id: 'e4', name: 'Deadlift', muscleGroup: 'Lưng', difficulty: 'Advanced', description: 'Bài tập compound mạnh mẽ nhất, phát triển lưng dưới, đùi sau và core.', instructions: '1. Đứng sát thanh tạ, chân rộng bằng hông\n2. Cúi xuống nắm tạ, lưng thẳng\n3. Đứng dậy bằng lực chân và hông\n4. Thực hiện 3 sets x 5 reps', caloriesPerHour: 450 },
  { id: 'e5', name: 'Plank', muscleGroup: 'Bụng', difficulty: 'Beginner', description: 'Bài tập isometric tuyệt vời cho core, không cần dụng cụ.', instructions: '1. Chống khuỷu tay, thẳng người\n2. Siết cơ bụng, giữ lưng thẳng\n3. Giữ 30-60 giây\n4. Nghỉ 30 giây, lặp lại 3-4 sets', caloriesPerHour: 250 },
  { id: 'e6', name: 'Pull-ups', muscleGroup: 'Lưng', difficulty: 'Intermediate', description: 'Bài tập kéo xà đơn phát triển cơ lưng rộng và tay trước.', instructions: '1. Nắm xà, grip rộng hơn vai\n2. Kéo người lên cho cằm qua xà\n3. Hạ người xuống có kiểm soát\n4. Thực hiện 4 sets x 6-10 reps', caloriesPerHour: 400 },
  { id: 'e7', name: 'Burpees', muscleGroup: 'Toàn thân', difficulty: 'Advanced', description: 'Bài tập toàn thân cường độ cao, đốt mỡ cực kỳ hiệu quả.', instructions: '1. Đứng thẳng → ngồi xổm → chống tay\n2. Nhảy chân ra sau (tư thế plank)\n3. Chống đẩy 1 cái\n4. Nhảy chân về → đứng dậy nhảy lên\n5. Thực hiện 4 sets x 10-15 reps', caloriesPerHour: 600 },
  { id: 'e8', name: 'Yoga Sun Salutation', muscleGroup: 'Toàn thân', difficulty: 'Beginner', description: 'Chuỗi động tác chào mặt trời, kết hợp thở và kéo giãn toàn diện.', instructions: '1. Mountain Pose → Forward Fold\n2. Halfway Lift → Plank\n3. Chaturanga → Upward Dog\n4. Downward Dog → Forward Fold\n5. Thực hiện 5-10 vòng', caloriesPerHour: 200 },
  { id: 'e9', name: 'Dumbbell Shoulder Press', muscleGroup: 'Vai', difficulty: 'Intermediate', description: 'Bài tập phát triển cơ vai delta trước và giữa với tạ đơn.', instructions: '1. Ngồi trên ghế, tạ ngang vai\n2. Đẩy tạ lên trên đầu\n3. Hạ tạ về vị trí ban đầu\n4. Thực hiện 4 sets x 10-12 reps', caloriesPerHour: 300 },
  { id: 'e10', name: 'Bicep Curls', muscleGroup: 'Tay trước', difficulty: 'Beginner', description: 'Bài tập cô lập cơ tay trước (biceps) với tạ đơn.', instructions: '1. Đứng thẳng, tạ hai bên\n2. Cuộn tạ lên, siết biceps\n3. Hạ tạ xuống có kiểm soát\n4. Thực hiện 3 sets x 12-15 reps', caloriesPerHour: 250 },
  { id: 'e11', name: 'Tricep Dips', muscleGroup: 'Tay sau', difficulty: 'Intermediate', description: 'Bài tập phát triển cơ tay sau (triceps) sử dụng trọng lượng cơ thể.', instructions: '1. Chống tay lên ghế/xà kép\n2. Hạ người xuống, khuỷu tay gập 90°\n3. Đẩy người lên về vị trí ban đầu\n4. Thực hiện 3 sets x 10-15 reps', caloriesPerHour: 350 },
  { id: 'e12', name: 'Mountain Climbers', muscleGroup: 'Toàn thân', difficulty: 'Intermediate', description: 'Bài tập cardio kết hợp core, mô phỏng động tác leo núi.', instructions: '1. Bắt đầu ở tư thế plank\n2. Kéo gối phải về ngực\n3. Đổi chân nhanh\n4. Thực hiện 3 sets x 30 giây', caloriesPerHour: 550 },
];


export const loadWorkouts = (): WorkoutEntry[] => {
  try {
    const raw = localStorage.getItem(KEYS.workouts);
    if (raw) return JSON.parse(raw);
    
    localStorage.setItem(KEYS.workouts, JSON.stringify(MOCK_WORKOUTS));
    return MOCK_WORKOUTS;
  } catch {
    return MOCK_WORKOUTS;
  }
};

export const saveWorkouts = (data: WorkoutEntry[]) => {
  localStorage.setItem(KEYS.workouts, JSON.stringify(data));
};

export const loadHealth = (): HealthRecord[] => {
  try {
    const raw = localStorage.getItem(KEYS.health);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(KEYS.health, JSON.stringify(MOCK_HEALTH));
    return MOCK_HEALTH;
  } catch {
    return MOCK_HEALTH;
  }
};

export const saveHealth = (data: HealthRecord[]) => {
  localStorage.setItem(KEYS.health, JSON.stringify(data));
};

export const loadGoals = (): Goal[] => {
  try {
    const raw = localStorage.getItem(KEYS.goals);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(KEYS.goals, JSON.stringify(MOCK_GOALS));
    return MOCK_GOALS;
  } catch {
    return MOCK_GOALS;
  }
};

export const saveGoals = (data: Goal[]) => {
  localStorage.setItem(KEYS.goals, JSON.stringify(data));
};

export const loadExercises = (): Exercise[] => {
  try {
    const raw = localStorage.getItem(KEYS.exercises);
    if (raw) return JSON.parse(raw);
    localStorage.setItem(KEYS.exercises, JSON.stringify(MOCK_EXERCISES));
    return MOCK_EXERCISES;
  } catch {
    return MOCK_EXERCISES;
  }
};

export const saveExercises = (data: Exercise[]) => {
  localStorage.setItem(KEYS.exercises, JSON.stringify(data));
};
