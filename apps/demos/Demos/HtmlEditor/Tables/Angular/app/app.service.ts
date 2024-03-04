import { Injectable } from '@angular/core';

const markup = `
    <h2>
        Hardware Upgrade
    </h2>
    <br>
    <table>
        <thead>
            <tr>
                <th style="text-align: left; width: 320px;">Task Subject</th>
                <th style="text-align: center;">Status</th>
                <th style="text-align: right;">Progress</th>
            </tr>
        </thead>
        <tbody>
            <tr style="text-align: center;">
                <td style="text-align: left; width: 320px;">Approve Personal Computer Upgrade Plan</td>
                <td style="text-align: center; color: #5cb85c;">
                    <p style="font-size: 1.15em;">✓</p>
                    <p>Completed</p>
                </td>
                <td style="text-align: right;">100%</td>
            </tr>
            <tr style="text-align: center;">
                <td style="text-align: left; width: 320px;">Prepare workspaces</td>
                <td style="text-align: center; color: #5cb85c;">
                    <p style="font-size: 1.15em;">✓</p>
                    <p>Completed</p>
                </td>
                <td style="text-align: right;">100%</td>
            </tr>
            <tr style="text-align: center;">
                <td style="text-align: left; width: 320px;">Upgrade Server Hardware</td>
                <td style="text-align: center;">
                    <p style="font-size: 1.15em;">⟳</p>
                    <p>In Progress</p>
                </td>
                <td style="text-align: right;">45%</td>
            </tr>     
            <tr style="text-align: center;">
                <td style="text-align: left; width: 320px;">Upgrade Personal Computers</td>
                <td style="text-align: center; color: #f0ad4e;">
                    <p style="font-size: 1.15em;">‖</p>
                    <p>Need Assistance</p>
                </td>
                <td style="text-align: right;">80%</td>
            </tr>
            <tr style="text-align: center;">
                <td style="text-align: left; width: 320px;">Replace HDD with SSD</td>
                <td style="text-align: center;">
                    <p style="font-size: 1.15em;">⟳</p>
                    <p>In Progress</p>
                </td>
                <td style="text-align: right;">80%</td>
            </tr>
            <tr style="text-align: center;">
                <td style="text-align: left; width: 320px;">Purchase a New Server</td>
                <td style="text-align: center; color: #d9534f;">
                    <p style="font-size: 1.15em;">✖</p>
                    <p>Canceled</p>
                </td>
                <td style="text-align: right;">15%</td>
            </tr>
            <tr style="text-align: center;">
                <td style="text-align: left; width: 320px;">Purchase Laptops</td>
                <td style="text-align: center; color: #5cb85c;">
                    <p style="font-size: 1.15em;">✓</p>
                    <p>Completed</p>
                </td>
                <td style="text-align: right;">100%</td>
            </tr>
            <tr style="text-align: center;">
                <td style="text-align: left; width: 320px;">Prepare a list of necessary devices for testing</td>
                <td style="text-align: center; color: #5cb85c;">
                    <p style="font-size: 1.15em;">✓</p>
                    <p>Completed</p>
                </td>
                <td style="text-align: right;">100%</td>
            </tr>
            <tr style="text-align: center;">
                <td style="text-align: left; width: 320px;">Purchase devices for testing</td>
                <td style="text-align: center; color: #f0ad4e;">
                    <p style="font-size: 1.15em;">‖</p>
                    <p>Need Assistance</p>
                </td>
                <td style="text-align: right;">25%</td>
            </tr>
            <tr style="text-align: center;">
                <td style="text-align: left; width: 320px;">Recycle Broken Hardware</td>
                <td style="text-align: center; color: #5cb85c;">
                    <p style="font-size: 1.15em;">✓</p>
                    <p>Completed</p>
                </td>
                <td style="text-align: right;">100%</td>
            </tr>
        </tbody>
    </table>
    <br>
`;

@Injectable()
export class Service {
  getMarkup(): string {
    return markup;
  }
}
