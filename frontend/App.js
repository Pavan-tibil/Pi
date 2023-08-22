import React, { useState, useEffect } from 'react'
import { Image, View, Text, Modal, Button, StyleSheet, ActivityIndicator } from 'react-native'
import DocumentScanner, { ResponseType } from 'react-native-document-scanner-plugin'
import axios from 'axios'
import { Icon } from 'react-native-elements';

export default app = () => {
  const [scannedImage, setScannedImage] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [resultsPage, setResultsPage] = useState(1);


  const Card = ({ title, content }) => {
    return (
      <View style={cardStyles.card}>
        <View>
          <Text>{'title'}</Text>
          <Text>{'value'}</Text>
        </View>
        <View>
          <Text>{'title'}</Text>
        </View>
        <View>
          <Text>{'title'}</Text>
          <Text>{'value'}</Text>
        </View>
      </View>
    );
  };

  const cardStyles = StyleSheet.create({
    card: {
      backgroundColor: 'white',
      borderRadius: 5,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
      elevation: 2,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 8,
    },


  });



  useEffect(() => {
    // call scanDocument on load
   // scanDocument();
   setPredictions({
        "cert_details": [
            {
                "stream": "COMMERCE"
            },
            {
                "school_no": "31.01.004"
            },
            {
                "month_year": "FEBRUARY-18"
            },
            {
                "board": "MUMBAI DIVISIONAL BOARD"
            },
            {
                "seat_no": "M226965"
            },
            {
                "sr_no": "170644"
            },
            {
                "centre_no": "3008"
            },
            {
                "name": "Khan Aryan Tanvir"
            },
            {
                "mothers_name": "Sherry"
            }
        ],
        "subjects": [
            {
                "subject_name": "ENGLISH",
                "subject_code": "01",
                "obtained_marks": "068",
                "medium": "ENG",
                "max_marks": "100"
            },
            {
                "subject_name": "ECONOMICS",
                "subject_code": "48",
                "max_marks": "100",
                "obtained_marks": "089",
                "medium": "ENG"
            },
            {
                "subject_name": "BOOK KEEPING & ACCOUNTANCY",
                "subject_code": "S0",
                "max_marks": "100",
                "obtained_marks": "063",
                "medium": "ENG"
            },
            {
                "subject_name": "ORGANISATION OF COMN & MGMT",
                "subject_code": "51"
            },
            {
                "subject_name": "",
                "subject_code": "100"
            },
            {
                "subject_name": "OFFICE MANAGEMENT",
                "subject_code": "A7",
                "max_marks": "‘",
                "obtained_marks": "189",
                "medium": "ENG"
            },
            {
                "subject_name": "ENVIRONMENT EDUCATION",
                "subject_code": "31",
                "obtained_marks": "048",
                "medium": "ENG",
                "max_marks": "050"
            }
        ],
        "result": [
            {
                "result": "PASS"
            },
            {
                "percentage": "83.54"
            },
            {
                "total_max_marks": "650"
            },
            {
                "total_obtained_marks": "543"
            }
        ]
    }
    );
   toggleModal();
  }, []);


  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const scanDocument = async () => {
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
      console.log('resp', response.data.data);
      setPredictions(response.data.data);
      toggleModal();
      setIsLoading(false);
    } catch (e) {
      console.log('err', e);
      setIsLoading(false);
    }
  }

  const goToNextPage = () => {
    let nextPage = resultsPage + 1;
    setResultsPage(nextPage);
 }

 const goToPrevPage = () => {
  let nextPage = resultsPage - 1;
  setResultsPage(nextPage);
 }

  const tableStyles = StyleSheet.create({
    headerText: {
      color: '#052C3C',
      fontFamily: 'fira sans',
      fontSize: 14,
      fontWeight: 'bold',
      textAlign: 'center',
      width: '100%',
      height: 17,
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
      textAlign: "center",
      fontSize: 10,
      color: "black",
      fontFamily: 'Fira Sans',
      fontWeight: '500'
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
      {label: "STREAM", key: "stream"}, 
      {label: "SEAT No.", key: "seat_no"}]
    return (
      <>
        <View>
          <Text style={tableStyles.headerText}>{'Mumbai Divisional Board'.toUpperCase()}</Text>
        </View>
        <View style={tableStyles.table}>
          {certDetailsKeys.map((data, index) => (
            <View style={tableStyles.row} key={`${index}-prediction`}>
              <Text style={tableStyles.cell}>{data.label} </Text>
              <Text style={tableStyles.cell}> {predictions.cert_details.find(obj => obj[data.key])[data.key]} </Text>
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
    switch(pageNumber) {
     case 1:
         return (
          <View style={tableStyles.container}>
            <Table />
          </View>
         )
     case 2:
          return (<Text>Second Page</Text>)

     default:
         return (<Text>Third Page</Text>)
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
    marginBottom: 19,
    paddingBottom: 30,
    paddingHorizontal: 60,
    alignItems: 'center',
    backgroundColor: 'white'
  },
  disabledIcon: {
    backgroundColor: 'white',
    color: '#C2C2C2',
    opacity: 0.5
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
              <Icon disabled={true} disabledStyle={styles.disabledIcon}  name="verticleright" size={20}  type="antdesign" onPress={goToPrevPage}/>
                <Icon name="left" size={20} color="#199AB7" type="antdesign" onPress={goToPrevPage}/>
                <Text>{resultsPage}</Text>
                <Icon name="right" size={20} color="#199AB7" type="antdesign" onPress={goToNextPage}/>
                <Icon disabled={true} disabledStyle={styles.disabledIcon} name="verticleleft" size={20} type="antdesign" onPress={goToPrevPage}/>
            </View>
          </View>


          {/* <View style={tableStyles.container}>
            <Card />

          </View> */}

        </Modal>
      </View>
    ))
}
