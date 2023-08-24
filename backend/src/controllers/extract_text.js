const ROI = require('../models/add_roi_model');
const DATA = require('../models/save_scanned_data_model')
const { createWorker } = require('tesseract.js');
const { PSM } = require('tesseract.js');
const Jimp = require('jimp');

exports.extractData = async (req, res) => {
    try {
        const { board_name, exam_type, stream, examination_year, image } = req.body;

        const findRoi = await ROI.findOne({ board_name });
        if (!findRoi) {
            return res.status(404).json({ error: 'ROI not found' });
        }
        if (findRoi.board_name === "Mumbai Divisional Board") {
            const worker = await createWorker();
            const rectangles = findRoi.boundaries;

            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            await worker.setParameters({
                tessedit_pageseg_mode: PSM.SINGLE_LINE,
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-& ' 
            });
            const values = [];
            let buff = Buffer.from(image, 'base64');
            let image1 = await Jimp.read(buff);
            image1 = image1
                .grayscale()
            const output = await image1.resize(1700, 2200).getBase64Async(Jimp.MIME_JPEG)
            let convertedBuffer = Buffer.from(output.split(',')[1], 'base64');


            for (let i = 0; i < rectangles.length; i++) {
                const rectangle = rectangles[i];
                const { data } = await worker.recognize(convertedBuffer, { rectangle: rectangle }); // Use the image data directly
                const cleanedText = data.text.replace(/\n/g, '');
                values.push({ tag: rectangle.tag, text: cleanedText, confidence: data.confidence });
            }

            await worker.terminate();
            console.log(values);
            const subjectsArray = []
            for (const data of values) {
                if (data.tag.startsWith('sub_')) {
                    const spilted_data = data.text.split(' ');
                    const subject_code = spilted_data.shift();
                    const subject_name = spilted_data.join(' ');
                    const subject_details = { 'subject_name': subject_name, 'subject_code': subject_code }
                    subjectsArray.push(subject_details)
                }
            }

            for (const item of values) {
                if (item.tag.startsWith('marks_')) {
                    const subjectName = item.tag.replace('marks_', '');
                    const subjectData = subjectsArray.find(subject => subject.subject_name === subjectName);

                    if (subjectData) {
                        const obtained_marks = item.text;
                        subjectData.obtained_marks = obtained_marks;
                        subjectData.medium = "ENG"
                    }
                }
                if (item.tag.startsWith('max_marks_')) {
                    const subjectName = item.tag.replace('max_marks_', '');
                    const subjectData = subjectsArray.find(subject => subject.subject_name === subjectName);
                    if (subjectData) {
                        const max_marks = item.text;
                        subjectData.max_marks = max_marks;

                    }
                }
            }
            const desiredTags = ['board', 'stream', 'seat_no', 'centre_no', 'school_no', 'month_year', 'sr_no', 'name', 'mothers_name']
            const extractedCertificateData = []
            const results = ['result', 'percentage', 'total_max_marks', 'total_obtained_marks']
            const extractedResultsData = []
            for (const item of values) {
                if (desiredTags.includes(item.tag)) {
                    extractedCertificateData.push({ [item.tag]: item.text })
                }
                if (results.includes(item.tag)) {
                    extractedResultsData.push({ [item.tag]: item.text })
                }
            }
            const finalOutput = { "cert_details": extractedCertificateData, "subjects": subjectsArray, "result": extractedResultsData }
            console.log(finalOutput);
            const a = []
            for (const i of values) {
                a.push(i.confidence)
            }
            sum = a.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            accuracyPercentage = (sum / (a.length * 100)) * 100
            console.log("Prediction accuracy: " + accuracyPercentage + "%");
            let update_extracted_data = { board_name: board_name, exam_type: exam_type, stream: stream, examination_year: examination_year, extracted_data: finalOutput, image: output.split(',')[1] }
            await DATA.create(update_extracted_data)

            res.status(200).json(finalOutput);
        }
        else if (findRoi.board_name === "YOYOGI HIGH SCHOOL") {
            const worker = await createWorker();
            const rectangles = findRoi.boundaries;
            const values = []; 
            let buff = Buffer.from(image, 'base64');
            let image1 = await Jimp.read(buff);
            image1 = image1
                .grayscale()
                .resize(1700, 2200);

            const output = await image1.getBase64Async(Jimp.MIME_JPEG);
            let convertedBuffer = Buffer.from(output.split(',')[1], 'base64');

            const workerConfig = {
                tessedit_pageseg_mode: PSM.SINGLE_BLOCK,
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-&IVXLCDM, '
            };

            for (const rectangle of rectangles) {
                if (rectangle.tag.startsWith('GRADE_') || rectangle.tag.startsWith('CREDITS_')) {
                    workerConfig.tessedit_pageseg_mode = PSM.SINGLE_DIGIT;
                    workerConfig.tessedit_char_whitelist = '0123456789';
                }
                else {
                    workerConfig.tessedit_pageseg_mode = PSM.SINGLE_BLOCK;
                    workerConfig.tessedit_char_whitelist = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.-&IVXLCDM, ';
                }

                await worker.loadLanguage('eng');
                await worker.initialize('eng');
                await worker.setParameters(workerConfig);

                const { data } = await worker.recognize(convertedBuffer, { rectangle: rectangle });
                const cleanedText = data.text.replace(/\n/g, ' ');
                const trimmedText = cleanedText.trim();
                values.push({ tag: rectangle.tag, text: trimmedText, confidence: data.confidence });
            }
            await worker.terminate();
            console.log(values);
            // Percentage caluclation
            const a = []
            for (const i of values) {
                a.push(i.confidence)
            }
            sum = a.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
            accuracyPercentage = (sum / (a.length * 100)) * 100
            console.log("Prediction accuracy: " + accuracyPercentage + "%");

            // Store values in the database or send as response
            let update_extracted_data = { board_name: board_name, extracted_data: values, image: output.split(',')[1] };
            await DATA.create(update_extracted_data);

            res.status(200).json(values); 
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to extract data' });
    }
};
