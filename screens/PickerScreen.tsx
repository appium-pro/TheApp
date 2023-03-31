/* global fetch */

import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {Button} from '@rneui/base';
import {testProps} from '../lib/utils';

const styles = StyleSheet.create({
  listHeader: {
    padding: 8,
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  pickerCont: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  picker: {
    width: '48%',
    height: 200,
  },
});

interface DateInfo {
  month: string;
  day: string;
}

export default function PickerScreen() {
  const [dateInfo, setDateInfo] = useState<DateInfo>({month: '1', day: '1'});

  async function fetchInfo() {
    const {month, day} = dateInfo;
    try {
      const res = await fetch(
        `https://history.muffinlabs.com/date/${month}/${day}`,
      );
      const json = await res.json();
      const evts = json.data.Events;
      const evtIdx = Math.floor(Math.random() * evts.length);
      const evt = evts[evtIdx];

      Alert.alert(
        `On this day (${month}/${day}) in ${evt.year}...`,
        evt.text,
        [{text: 'OK'}],
        {cancelable: false},
      );
    } catch (err: any) {
      Alert.alert('Error', err.message, [{text: 'OK'}], {cancelable: false});
    }
  }

  const dayItems = [];
  for (let i = 1; i <= 31; i++) {
    dayItems.push(
      <Picker.Item key={i} label={i.toString()} value={i.toString()} />,
    );
  }

  return (
    <ScrollView>
      <Text style={styles.listHeader}>Pick a date to learn more about it</Text>
      <View style={styles.pickerCont}>
        <Picker
          style={styles.picker}
          {...testProps('monthPicker')}
          selectedValue={dateInfo.month}
          onValueChange={itemValue =>
            setDateInfo({...dateInfo, month: itemValue})
          }>
          <Picker.Item label="January" value="1" />
          <Picker.Item label="February" value="2" />
          <Picker.Item label="March" value="3" />
          <Picker.Item label="April" value="4" />
          <Picker.Item label="May" value="5" />
          <Picker.Item label="June" value="6" />
          <Picker.Item label="July" value="7" />
          <Picker.Item label="August" value="8" />
          <Picker.Item label="September" value="9" />
          <Picker.Item label="October" value="10" />
          <Picker.Item label="November" value="11" />
          <Picker.Item label="December" value="12" />
        </Picker>
        <Picker
          style={styles.picker}
          {...testProps('dayPicker')}
          selectedValue={dateInfo.day}
          onValueChange={itemValue =>
            setDateInfo({...dateInfo, day: itemValue})
          }>
          {dayItems}
        </Picker>
      </View>
      <Button
        title="Learn More"
        onPress={fetchInfo}
        {...testProps('learnMore')}
      />
    </ScrollView>
  );
}
