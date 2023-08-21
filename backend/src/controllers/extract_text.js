const ROI = require('../models/add_roi_model');
const DATA = require('../models/save_scanned_data_model')
const { createWorker } = require('tesseract.js');
const { PSM } = require('tesseract.js');
const Jimp = require('jimp');

exports.extractData = async (req, res) => {
    try {
        const { board_name, exam_type, stream, examination_year, image } = req.body;

        const findRoi = await ROI.findOne({ board_name, exam_type, stream, examination_year });
        if (!findRoi) {
            return res.status(404).json({ error: 'ROI not found' });
        }

        const worker = await createWorker();
        const rectangles = findRoi.boundaries;

        await worker.loadLanguage('eng');
        await worker.initialize('eng');
        await worker.setParameters({ tessedit_pageseg_mode: PSM.SINGLE_LINE });
        const values = [];
        let buff = Buffer.from(image, 'base64');
        let image1 = await Jimp.read(buff);
        output = await image1.resize(1700, 2200).getBase64Async(Jimp.MIME_JPEG)
        console.log(output.split(',')[1]);
        let convertedBuffer = Buffer.from(output.split(',')[1], 'base64');


        for (let i = 0; i < rectangles.length; i++) {
            const rectangle = rectangles[i];
            const { data } = await worker.recognize(convertedBuffer, { rectangle: rectangle }); // Use the image data directly
            const cleanedText = data.text.replace(/\n/g, '');
            values.push({ tag: rectangle.tag, text: cleanedText, confidence: data.confidence });
        }

        await worker.terminate();
        console.log(values);
        for (const data of values) {
            if (data.tag.startsWith('sub_')) {
                const spilted_data = data.text.split(' ');
                const subject_code = spilted_data.shift();
                const subject_name = spilted_data.join(' ');
                console.log(subject_code,subject_name);
                data.subjects = []
                values.push({ tag: 'subject_name', text: subject_name, confidence: data.confidence }, { tag: 'subject_code', text: subject_code, confidence: data.confidence })
            }
        }
        filtered_values = values.filter(item => !item.tag.startsWith('sub_'));
        console.log(filtered_values);
        let update_extracted_data = { board_name: board_name, exam_type: exam_type, stream: stream, examination_year: examination_year, data: filtered_values, image: output.split(',')[1] }
        await DATA.create(update_extracted_data)
        console.log(update_extracted_data);

        res.status(200).json(update_extracted_data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to extract data' });
    }
};



