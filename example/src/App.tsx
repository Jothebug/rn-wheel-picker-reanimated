import { StyleSheet, View } from 'react-native';
import { WheelPicker } from 'rn-wheel-picker-reanimated';

const generateYearsBetween = (startYear: number, endYear: number) => {
  const _endYear = endYear || new Date().getFullYear();
  let years = [];
  while (startYear <= _endYear) {
    years.push({ label: `${startYear}`, value: startYear });
    startYear++;
  }
  return years;
};

const MONTHS = [
  {
    label: 'January',
    value: 1,
  },
  {
    label: 'February',
    value: 2,
  },
  {
    label: 'March',
    value: 3,
  },
  {
    label: 'April',
    value: 4,
  },
  {
    label: 'May',
    value: 5,
  },
  {
    label: 'June',
    value: 6,
  },
  {
    label: 'July',
    value: 7,
  },
  {
    label: 'August',
    value: 8,
  },
  {
    label: 'September',
    value: 9,
  },
  {
    label: 'October',
    value: 10,
  },
  {
    label: 'November',
    value: 11,
  },
  {
    label: 'December',
    value: 12,
  },
];

const GENDER = [
  { label: 'Female', value: 0 },
  { label: 'Male', value: 1 },
  { label: 'Other', value: 2 },
];

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.timeContainer}>
        <WheelPicker
          data={MONTHS}
          itemHeight={35}
          initialValue={7}
          style={styles.timeWheel}
        />
        <WheelPicker
          data={generateYearsBetween(1900, 2100)}
          initialValue={2024}
          itemHeight={35}
          style={styles.timeWheel}
        />
      </View>

      <View style={styles.genderContainer}>
        <WheelPicker data={GENDER} numberOfVisibleRows={GENDER.length} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  timeContainer: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeWheel: {
    width: '25%',
  },
  genderContainer: {
    backgroundColor: 'white',
    alignItems: 'center',
    marginTop: 20,
  },
});
