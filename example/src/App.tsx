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

const YEARS = generateYearsBetween(1900, 2100);

export default function App() {
  return (
    <View style={styles.container}>
      <WheelPicker data={YEARS} numberOfVisibleRows={5} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
