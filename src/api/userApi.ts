import { IUser } from '../context/UserContext';

// Chỉ giữ user Công Chính để test
let mockUsers: (IUser & { password: string })[] = [
  {
    email: 'congchinhtran99@email.com',
    password: '123456',
    name: 'Công Chính',
    avatar: require('../assert/image/realuser.jpg'),
    // joined sẽ cập nhật realtime khi đăng nhập
    point: 100,
  },
];

// Hàm lấy user và cập nhật joined realtime khi đăng nhập thành công
export const getUserByEmailAndPassword = async (email: string, password: string): Promise<IUser | null> => {
  await new Promise(res => setTimeout(res, 200));
  const user = mockUsers.find(user => user.email === email && user.password === password);
  if (user) {
    // Cập nhật joined thành ngày giờ hiện tại (dd/mm/yyyy)
    const now = new Date();
    const joined = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')}/${now.getFullYear()}`;
    return { ...user, joined };
  }
  return null;
};

export const deleteUserByEmail = async (email: string) => {
  // Xóa user khỏi mockUsers (nếu cần)
  // Nếu chỉ có 1 user test thì có thể không cần xóa thực sự, chỉ cần setUser(null) ở context là đủ
  // Nhưng để đúng mock, ta sẽ filter ra khỏi mảng
  mockUsers = mockUsers.filter(user => user.email !== email);
  return true;
};
