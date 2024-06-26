import { launch } from 'puppeteer';

interface Options {
    puppeteerPath?: string;
    viewportWidth?: number;
    viewportHeight?: number;
    minSize?: number;
    maxSize?: number;
    backgroundColor?: string;
    font?: string;
    padding?: number;
}

const defaultOpts: Options = {
    puppeteerPath: undefined,
    viewportWidth: 800,
    viewportHeight: 400,
    minSize: 10,
    maxSize: 100,
    backgroundColor: "#f0f0f0",
    font: "Impact",
    padding: 5
};


/**
 * 
 * @param words Array of strings or Map of strings and frequencies
 * @param normalize Normalize frequencies (recommended)
 * @param savePath Path to save image
 * @param opts Other options
 */

export async function generate(words: string | string[] | Map<string, number> , normalize: boolean = true, savePath: string = 'wordcloud.png' ,opts : Options = {}) 
{
        opts = { ...defaultOpts, ...opts };

       
        let wordsMap : Map<string, number> = new Map();

        if(words instanceof Array){
            for(let word of words){
                const frequency = wordsMap.get(word) || 0;
                wordsMap.set(word, frequency + 1);
            }
        } else if (typeof words === 'string') {
            words = words.split(' ');
            for(let word of words){
                const frequency = wordsMap.get(word) || 0;
                wordsMap.set(word, frequency + 1);
            }
        } else if (words instanceof Map){
            wordsMap = words;
        } else{
            throw new Error('Invalid input type. Expected string or string[] or Map<string, number>');
        }

        const wordsObj: { text: string; size: number }[] = [] 
        wordsMap.forEach((value, key) => {
            wordsObj.push({
                text: key,
                size: value
            });
        });
        
        const minFreq = Math.min(...wordsObj.map(w => w.size || 0));
        const maxFreq = Math.max(...wordsObj.map(w => w.size || 0));

        const normalizeFunc = (frequency: number) => {
            if(normalize) {
                return opts.minSize + (opts.maxSize - opts.minSize) * (Math.log(frequency) - Math.log(minFreq)) / (Math.log(maxFreq) - Math.log(minFreq));
            }
            else{
                return frequency
            }
        };

        const normalizedWords = normalize ? wordsObj.map(word => ({
            text: word.text,
            size: normalizeFunc(word.size || 0)
        })) : wordsObj;
    

        const generateWordCloudHTML = (words: { text: string; size: number}[], backgroundColor: string, font: string, padding: number, viewportWidth: number, viewportHeight: number) => {
            return `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Word Cloud</title>
                    <script src="https://cdn.jsdelivr.net/npm/d3@5"></script>
                    <script src="https://cdn.jsdelivr.net/npm/d3-cloud"></script>
                    <style>
                        body {
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            height: 100vh;
                            margin: 0;
                            background-color: ${backgroundColor};
                        }
                        svg {
                            /* width: 100%;
                            height: 100%; */
                        }
                    </style>
                </head>
                <body>
                    <script>
                        const words = ${JSON.stringify(words)};
                        const viewportWidth = ${viewportWidth};
                        const viewportHeight = ${viewportHeight};
        
                        const layout = d3.layout.cloud()
                            .size([viewportWidth, viewportHeight])
                            .words(words.map(word => ({text: word.text, size: word.size})))
                            .padding(${padding})
                            .rotate(() => ~~(Math.random() * 2) * 90)
                            .font("${font}")
                            .fontSize(d => d.size)
                            .on("end", draw);
        
                        layout.start();
        
                        function draw(words) {
                            d3.select("body").append("svg")
                                .attr("width", viewportWidth)
                                .attr("height", viewportHeight)
                                .append("g")
                                .attr("transform", "translate(" + viewportWidth / 2 + "," + viewportHeight / 2 + ")") 
                                .selectAll("text")
                                .data(words)
                                .enter().append("text")
                                .style("font-size", d => d.size + "px")
                                .style("font-family", "Impact")
                                .style("fill", (d, i) => d3.schemeCategory10[i % 10])
                                .attr("text-anchor", "middle")
                                .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")") 
                                .text(d => d.text);
                        }
                    </script>
                </body>
                </html>
            `;
        };

        let browser;
        if(opts.puppeteerPath) {
             browser = await launch({headless:true, executablePath: opts.puppeteerPath,args: [
                '--no-sandbox',
                '--disable-setuid-sandbox'
                ],
            });
        }
        else browser = await launch({headless: true,args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
            ],  
        });
        const page = await browser.newPage();
        const content = generateWordCloudHTML(normalizedWords, opts.backgroundColor, opts.font, opts.padding, opts.viewportWidth, opts.viewportHeight)
        await page.setContent(content);

        await page.setViewport({ width: opts.viewportWidth, height: opts.viewportHeight });
        await page.screenshot({ path: savePath });
    
        await browser.close();
    }

