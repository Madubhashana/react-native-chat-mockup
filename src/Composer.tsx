import PropTypes from 'prop-types'
import React, {   useState } from 'react'
import { 
  StyleSheet,
  TextInput,
  TextInputProps, 
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native'
import { DEFAULT_PLACEHOLDER } from './Constant'
import Color from './Color'
import { StylePropType } from './utils' 

export interface ComposerProps {
  composerHeight?: number
  text?: string
  placeholder?: string
  placeholderTextColor?: string
  textInputProps?: Partial<TextInputProps>
  textInputStyle?: TextInputProps['style']
  textInputAutoFocus?: boolean
  keyboardAppearance?: TextInputProps['keyboardAppearance']
  multiline?: boolean
  disableComposer?: boolean
  onTextChanged?(text: string): void
  onInputSizeChanged?(layout: { width: number; height: number }): void
}

export function Composer({ 
  disableComposer = false,
  keyboardAppearance = 'default',
  multiline = true,
  onInputSizeChanged = () => {},
  onTextChanged = () => {},
  placeholder = DEFAULT_PLACEHOLDER,
  placeholderTextColor = Color.defaultColor,
  text = '',
  textInputAutoFocus = false,
  textInputProps = {},
  textInputStyle,
}: ComposerProps): React.ReactElement {
  const [newContentSize, setNewContentSize] = useState<
  NativeSyntheticEvent<TextInputContentSizeChangeEventData>['nativeEvent']['contentSize'] | undefined
>();
 

  const onContentSizeChange=(e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>)=>{
    if(!e.nativeEvent.contentSize) return;
    const contentSize = e.nativeEvent.contentSize;
    if (
      !newContentSize ||
      (newContentSize && newContentSize.height !== contentSize.height)
    ) {
      setNewContentSize(contentSize);
      if (!text?.length && onInputSizeChanged) {  
        onInputSizeChanged({width: 0, height: 0});
      } else if (onInputSizeChanged) {
        onInputSizeChanged(contentSize);
      }
    }

  }

  const style = [styles.textInput,textInputStyle]

  return (
    <TextInput
      testID={placeholder}
      accessible
      accessibilityLabel={placeholder}
      placeholder={placeholder}
      placeholderTextColor={placeholderTextColor}
      multiline={multiline}
      editable={!disableComposer}
      onContentSizeChange={onContentSizeChange}
      onChangeText={onTextChanged}
      textBreakStrategy='highQuality'
      style={style}
      autoFocus={textInputAutoFocus}
      value={text}
      enablesReturnKeyAutomatically
      underlineColorAndroid='transparent'
      keyboardAppearance={keyboardAppearance}
      {...textInputProps}
    />
  )
}

const styles = StyleSheet.create({
  textInput: { 
    lineHeight: 22, 
    textAlignVertical: 'top',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    fontSize: 16,
    maxHeight:150,
    flex:1
  },
})

Composer.propTypes = {
  composerHeight: PropTypes.number,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  placeholderTextColor: PropTypes.string,
  textInputProps: PropTypes.object,
  onTextChanged: PropTypes.func,
  onInputSizeChanged: PropTypes.func,
  multiline: PropTypes.bool,
  disableComposer: PropTypes.bool,
  textInputStyle: StylePropType,
  textInputAutoFocus: PropTypes.bool,
  keyboardAppearance: PropTypes.string,
}
