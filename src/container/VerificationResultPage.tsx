import React, { useState } from 'react'
import { Text, View, ScrollView, StyleSheet, PixelRatio, Pressable } from 'react-native'
import { AppButton } from '../components/customButton'
import AppClickableImage from '../components/customImage'
import ResultBanner from '../components/resultBanner'
import ResultRecord from '../components/resultRecord'
import { Props, BaseResponse } from '../types'
import FontStyle from '../utils/FontStyleHelper'
import { useTranslation } from '../services/i18n/i18nUtils'

const images = {
  qrError: require('../../assets/img/error/qr-error.png'),
  leftCaret: require('../../assets/img/verificationresult/left-caret.png'),
}

const canShowResult = ( result: BaseResponse): boolean => {
  return ( result.isValid ) 
}

const issuerRecognized = ( result: BaseResponse): boolean => {
  return !!result?.issuerData?.name
}

const initiallyShowRecord = ( result: BaseResponse ): boolean=>{
  return ( canShowResult( result ) && issuerRecognized( result ) )
}

const VerificationResultPage = ({ route, navigation }: Props) => {
  const data = route.params
  const { validationResult } = data
  const canToggleResult    = canShowResult( validationResult )
  const isIssuerRecognized = issuerRecognized( validationResult)
  const [ showResult, setShowResult ] = useState(initiallyShowRecord( validationResult ) )

  const resultBannerClicked = ()=>{
    if ( canToggleResult && !isIssuerRecognized ) {
      setShowResult( !showResult )
    }
  }  
  const { t } = useTranslation()

  return ( 
    <View style={ styles.flexContainer }>
      <View style={ styles.backButtonContainer }>
        <AppClickableImage
          styles={ styles.leftCaretImage }
          source={ images.leftCaret }
          onPress={ () => navigation.navigate('Welcome') }
        />
        <Text
          style={ [styles.backButtonText, FontStyle.Poppins_700Bold] }
          onPress={ () => navigation.navigate('Welcome') }
        >
          { t('Result.ResultTitle', 'Verification Result') }
        </Text>
      </View>
      <ScrollView>
        <Pressable onPress={ resultBannerClicked } >
          <ResultBanner validationResult={ validationResult } showContent={ showResult } />
        </Pressable>
        { showResult && validationResult.isValid && <ResultRecord data={ data } /> }
      </ScrollView>
      <AppButton
        title={ t('Common.ScanNext', 'Scan next vaccination record') }
        onPress={ () => navigation.navigate('ScanQR') }
        backgroundColor="#255DCB"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    paddingBottom: 30,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between',
    backgroundColor: '#F3F6FF',
  },
  backButtonContainer: {
    paddingTop: '15%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButtonText: {
    paddingLeft: 10,
    fontSize: 20,
    lineHeight: 30,
    color: '#255DCB',
  },
  leftCaretImage: {
    width: 12 * PixelRatio.getFontScale(),
    height: 19 * PixelRatio.getFontScale(),
  },
})

export default VerificationResultPage
