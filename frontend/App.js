import React, { useState, useEffect } from 'react'
import { Image, View, Text, Modal, Button, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin'
import axios from 'axios'
import { Icon } from 'react-native-elements';

export default app = () => {
  const [scannedImage, setScannedImage] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultsPage, setResultsPage] = useState(1);
  const [showHomePage, setShowHomePage] = useState(true);


  const Subjects = () => {
    let subjects = predictions.subjects;

    console.log(subjects);
    return (
      <>

        <View style={cardStyles.container}>
          <Text style={{ color: '#396677', fontFamily: 'fira sans', fontSize: 10, marginBottom: 20 }}>{'Medium'.toUpperCase()} : <Text style={{ fontSize: 14, color: '#07394D' }}>{'ENG'}</Text></Text>
          <ScrollView>

            <Card subject={subjects[0]}></Card>
            <Card subject={subjects[1]}></Card>
            <Card subject={subjects[2]}></Card>
            <Card subject={subjects[3]}></Card>
            <Card subject={subjects[4]}></Card>
            <Card subject={subjects[5]}></Card>

          </ScrollView>
        </View>

      </>
    );
  };

  const Card = (props) => {
    let sub = props.subject;
    return (
      <View style={cardStyles.table}>

        <View style={cardStyles.row}>
          <View style={cardStyles.cell}>
            <Text style={{ fontSize: 10, color: '#396677' }}> SUBJECT CODE: </Text>
            <Text style={{ fontSize: 14, color: '#07394D' }}> {sub.subject_code  || " "} </Text>
          </View>
          <View style={cardStyles.cell}>
            <Text style={{ fontSize: 10, color: '#396677' }}> SUBJECT NAME: </Text>
            <Text style={{ fontSize: 14, color: '#07394D' }}> {sub.subject_name  || " "}  </Text>
          </View>
        </View>
        <View style={cardStyles.row}>
          <View style={cardStyles.cell}>
            <Text style={{ fontSize: 10, color: '#396677' }}> MAX MARKS: </Text>
            <Text style={{ fontSize: 14, color: '#07394D' }}> {sub.max_marks  || " "} </Text>
          </View>
          <View style={cardStyles.cell}>
            <Text style={{ fontSize: 10, color: '#396677' }}> MARKS OBTAINED: </Text>
            <Text style={{ fontSize: 14, color: '#07394D' }}> {sub.obtained_marks || " " }  </Text>
          </View>
        </View>

      </View>

    )
  }

  const cardStyles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderRadius: 1,
      borderColor: "#CDD8DD",
      borderStyle: "dotted",
      padding: 16,
      marginTop: 16,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
      width: '80%',

      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'stretch',
    }, topLeft: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    topRight: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-end',
    },
    bottomLeft: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
    },
    bottomRight: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    }, table: {
      marginBottom: 20,
      borderWidth: 1,
      borderRadius: 1,
      borderColor: "#CDD8DD",
      borderStyle: "dotted",
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    cell: {
      flex: 1,
      padding: 10,
      textAlign: "center",
      fontSize: 10,
      color: "black",
      fontFamily: 'Fira Sans',
      fontWeight: '500'
    },
    container: {
      backgroundColor: '#fff',
      padding: 20,
      borderWidth: 1,
      borderRadius: 2,
      borderColor: "#CDD8DD",
      borderStyle: "dashed",
      color: '#052C3C',
      fontFamily: 'Fira Sans',
      fontSize: 10,
      borderBottomWidth: 0,
      width: '100%'
    }


  });



  useEffect(() => {
    // call scanDocument on load
   // scanDocument();
    // setPredictions({
    //   "cert_details": [
    //     {
    //       "stream": "COMMERCE"
    //     },
    //     {
    //       "school_no": "31.01.004"
    //     },
    //     {
    //       "month_year": "FEBRUARY-18"
    //     },
    //     {
    //       "board": "MUMBAI DIVISIONAL BOARD"
    //     },
    //     {
    //       "seat_no": "M226965"
    //     },
    //     {
    //       "sr_no": "170644"
    //     },
    //     {
    //       "centre_no": "3008"
    //     },
    //     {
    //       "name": "Khan Aryan Tanvir"
    //     },
    //     {
    //       "mothers_name": "Sherry"
    //     }
    //   ],
    //   "subjects": [
    //     {
    //       "subject_name": "ENGLISH",
    //       "subject_code": "01",
    //       "obtained_marks": "068",
    //       "medium": "ENG",
    //       "max_marks": "100"
    //     },
    //     {
    //       "subject_name": "ECONOMICS",
    //       "subject_code": "48",
    //       "max_marks": "100",
    //       "obtained_marks": "089",
    //       "medium": "ENG"
    //     },
    //     {
    //       "subject_name": "BOOK KEEPING & ACCOUNTANCY",
    //       "subject_code": "S0",
    //       "max_marks": "100",
    //       "obtained_marks": "063",
    //       "medium": "ENG"
    //     },
    //     {
    //       "subject_name": "ORGANISATION OF COMN & MGMT",
    //       "subject_code": "51"
    //     },
    //     {
    //       "subject_name": "",
    //       "subject_code": "100"
    //     },
    //     {
    //       "subject_name": "OFFICE MANAGEMENT",
    //       "subject_code": "A7",
    //       "max_marks": "‘",
    //       "obtained_marks": "189",
    //       "medium": "ENG"
    //     },
    //     {
    //       "subject_name": "ENVIRONMENT EDUCATION",
    //       "subject_code": "31",
    //       "obtained_marks": "048",
    //       "medium": "ENG",
    //       "max_marks": "050"
    //     }
    //   ],
    //   "result": [
    //     {
    //       "result": "PASS"
    //     },
    //     {
    //       "percentage": "83.54"
    //     },
    //     {
    //       "total_max_marks": "650"
    //     },
    //     {
    //       "total_obtained_marks": "543"
    //     }
    //   ]
    // }
    // );
    // toggleModal();
  }, []);


  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const scanDocument = async () => {

    setShowHomePage(false);
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument({
      croppedImageQuality: 100,
      responseType: ResponseType.Base64,
      maxNumDocuments: 1,
      letUserAdjustCrop: true
    })

    //  console.log('scannedImages', scannedImages);
    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0])
      processImage(scannedImages[0])
    }
  }

  const processImage = async (img) => {
    let body = {
      "board_name": "Mumbai Divisional Board",
      "exam_type": "Higher Secondary Certificate Examination",
      "stream": "Commerce",
      "examination_year": "2018",
      "image": img
    }

    try {
      setIsLoading(true);
      let response = await axios.post("http://localhost:3000/data", body);
      console.log('resp', response.data);
      setPredictions(response.data);

      // setIsLoading(false);
      // setTimeout(3);
      // toggleModal();
      setTimeout(() => {
        console.log(predictions);
        setIsLoading(false);
        toggleModal();
        
      }, 1000);
    } catch (e) {
      console.log('err', e);
      setIsLoading(false);
    }
  }



  const goToNextPage = () => {
    if (resultsPage < 3) {
      let nextPage = resultsPage + 1;
      setResultsPage(nextPage);
    }
  }

  const goToFirstPage = () => {
    setResultsPage(1);
  }

  const goToLastPage = () => {
    setResultsPage(3);
  }

  const goToPrevPage = () => {
    if (resultsPage > 1) {
      let nextPage = resultsPage - 1;
      setResultsPage(nextPage);
    }
  }

  const tableStyles = StyleSheet.create({
    headerText: {
      color: '#052C3C',
      // fontFamily: 'FiraSans-Regular',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      width: '100%',
      marginTop: 10,
      marginBottom: 30
    },
    table: {
      borderWidth: 1,
      borderRadius: 1,
      borderColor: "#CDD8DD",
      borderStyle: "dotted",
    },
    row: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
    },
    cell: {
      flex: 1,
      padding: 10,
      borderWidth: 1,
      borderRadius: 1,
      borderColor: "#CDD8DD",
      borderStyle: "dashed",
      fontSize: 10,
      color: "#396677",
      fontFamily: 'FiraSans-Regular',
      fontWeight: "500",
      height: 44,
    }, cell2: {
      flex: 1,
      padding: 10,
      borderWidth: 1,
      borderRadius: 1,
      borderColor: "#CDD8DD",
      borderStyle: "dashed",
      fontSize: 14,
      color: "#07394D",
      fontFamily: 'FiraSans-Regular',
      fontWeight: "400",
      height: 44,
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      borderColor: '#CDD8DD',
      borderWidth: 1,
      borderStyle: 'dashed',
      color: '#052C3C',
      fontFamily: 'Fira Sans',
      fontSize: 10,
      borderBottomWidth: 0,
      width: '100%'
    }
  });


  const Table = () => {
    let certDetailsKeys = [
      { label: "STREAM", key: "stream" },
      { label: "SEAT No.", key: "seat_no" },
      { label: "CENTRE No.", key: "centre_no" },
      { label: "DIST. & HR. SEC. SCHOOL NO.", key: "school_no" },
      { label: "MONTH & YEAR OF EXAM", key: "month_year" },
      { label: "SR. NO. OF STATEMENT", key: "sr_no" },
      { label: "CANDIDATE’S FULL NAME", key: "name" },
      { label: "CANDIDATE’S MOTHER’S NAME", key: "mothers_name" }
    ]
    return (
      <>
        <View>
          <Text style={tableStyles.headerText}>{'Mumbai Divisional Board'.toUpperCase()}</Text>
        </View>
        <View style={tableStyles.table}>
          {certDetailsKeys.map((data, index) => (
            <View style={tableStyles.row} key={`${index}-prediction`}>
              <Text style={tableStyles.cell}>{data.label} </Text>
              <Text style={[tableStyles.cell2, { fontSize: 14 }]}> {predictions.cert_details.find(obj => obj[data.key])[data.key]} </Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  const Result = () => {
    let resultKeys = [
      { label: "RESULT", key: "result" },
      { label: "PERCENTAGE", key: "percentage" },
      { label: "TOTAL MARKS", key: "total_max_marks" },
      { label: "MARKS OBTAINED", key: "total_obtained_marks" },
    ]

    return (
      <>
        <View>
          <Text style={tableStyles.headerText}>{'Overall Performance'.toUpperCase()}</Text>
        </View>
        <View style={tableStyles.table}>
          {resultKeys.map((data, index) => (
            <View style={tableStyles.row} key={`${index}-prediction`}>
              <Text style={tableStyles.cell}>{data.label} </Text>
              <Text style={[tableStyles.cell, { fontSize: 14 }]}> {predictions.result.find(obj => obj[data.key])[data.key]} </Text>
            </View>
          ))}
        </View>
      </>
    );
  };

  const loaderStyle = StyleSheet.create({
    centered: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#ddd'
    }
  });

  renderPredictionsData = (pageNumber) => {
    switch (pageNumber) {
      case 1:
        return (
          <View style={tableStyles.container}>
            <Table />
          </View>
        )
      case 2:
        return (<Subjects />)

      default:
        return (
          <View style={tableStyles.container}>
            <Result />
          </View>
        )
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      marginTop: 19,
      marginRight: 15,
      marginLeft: 15,
      backgroundColor: 'white'
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: "space-around",
      marginLeft: 15,
      marginRight: 15,
      paddingBottom: 20,
      paddingHorizontal: 60,
      alignItems: 'center',
      backgroundColor: 'white'
    },
    logo: {
      justifyContent: "center",
      alignItems: 'center',
      backgroundColor: 'white',
      marginBottom: 19,
      paddingBottom: 10,
      marginLeft: 15,
      marginRight: 15,
    },
    disabledIcon: {
      backgroundColor: 'white',
      color: '#C2C2C2',
      opacity: 0.5
    },
    arrowIcon: {
      backgroundColor: 'white',
      color: '#199AB7'
    },
    text: {
      marginVertical: 5,
      marginBottom: 5
    },
  });

  return (
    isLoading ? (
      <View style={loaderStyle.centered}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    ) : (

      showHomePage ? (
        
        <View style={styles.container}>
          <Text>Home</Text>
        </View>

      ) : (
        <View style={{ flex: 1 }}>
        <Image
          resizeMode="contain"
          style={{ width: '100%', height: '80%' }}
          source={{ uri: `data:image/jpeg;base64,${scannedImage}` }}
        />

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={toggleModal}
        >

          <View style={{ flex: 1, backgroundColor: '#CDD8DD', borderRadius: 4 }}>
            <View style={styles.container}>
              {/* <View> */}
              {
                renderPredictionsData(resultsPage)
              }
              {/* </View> */}
            </View>

            <View style={styles.buttonsContainer}>
              <Icon disabled={resultsPage === 1 ? true : false} disabledStyle={resultsPage === 1 ? styles.disabledIcon : styles.enabledIcon} name="verticleright" size={20} type="antdesign" color="#199AB7" onPress={goToFirstPage} />
              <Icon disabled={resultsPage === 1 ? true : false} disabledStyle={resultsPage === 1 ? styles.disabledIcon : styles.enabledIcon} name="left" size={20} color="#199AB7" type="antdesign" onPress={goToPrevPage} />
              <Text>{resultsPage}</Text>
              <Icon disabled={resultsPage === 3 ? true : false} disabledStyle={styles.disabledIcon} name="right" size={20} color="#199AB7" type="antdesign" onPress={goToNextPage} />
              <Icon disabled={resultsPage === 3 ? true : false} disabledStyle={styles.disabledIcon} name="verticleleft" size={20} type="antdesign" onPress={goToLastPage} color="#199AB7" />
            </View>
            <View style={styles.logo}>
              <Image source={require('./assets/images/P!_logo.png')} style={{ width: 17, height: 20 }} />
            </View>

          </View>

        </Modal>
      </View>
      )


    ))
}
