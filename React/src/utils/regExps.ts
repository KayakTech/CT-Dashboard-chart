export const regExps = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  password:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  last_name: /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s]{2,30}$/,
  first_name: /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s]{2,30}$/,
  full_name: /^[a-zA-Zа-яА-ЯёЁ]+(?:[-\s'][a-zA-Zа-яА-ЯёЁ]+)*$/,
  names: /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s]{2,30}$/,
  phone: /^\d{9}$/,
  otp: /^\d{6}$/,
  address: /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ\s]{2,30}$/,
  onlyNumbers: /^\d+$/,
  numbersDouble: /^[0-9,.]+$/,
  amountMoney: /^(\d*\.?\d{0,2})?$/,
};
